#!/usr/bin/env bash
# SessionStart hook for ghost-skills plugin
# Reports session ID and injects bootstrap skill content

set -euo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Escape string for JSON embedding using bash parameter substitution.
# Each ${s//old/new} is a single C-level pass - much faster than char-by-char.
escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

# Find the session ID from recently modified files
find_session_id() {
    local session_id=""

    if [ -d "$HOME/.claude/projects" ]; then
        session_id=$(find "$HOME/.claude/projects" -name "*.jsonl" -type f -mmin -10 2>/dev/null \
            | xargs ls -t 2>/dev/null \
            | head -1 \
            | xargs -I{} basename {} .jsonl 2>/dev/null || true)
    fi

    if [ -z "$session_id" ] && [ -d "$HOME/.claude/debug" ]; then
        session_id=$(find "$HOME/.claude/debug" -name "*.txt" -type f -mmin -10 2>/dev/null \
            | xargs ls -t 2>/dev/null \
            | head -1 \
            | xargs -I{} basename {} .txt 2>/dev/null || true)
    fi

    if [[ "$session_id" =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
        echo "$session_id"
    else
        echo "unknown"
    fi
}

# Get session ID
SESSION_ID=$(find_session_id)

# Build session message
if [ "$SESSION_ID" != "unknown" ]; then
    session_message="SessionStart:Callback hook success: Success\nThis is Claude Session ID: ${SESSION_ID}"
else
    session_message="SessionStart:Callback hook success: Success\nSession ID could not be determined (session may be initializing)"
fi

# Read bootstrap skill content
bootstrap_skill="${PLUGIN_ROOT}/skills/ghost-using-ghost-skills/SKILL.md"
if [ -f "$bootstrap_skill" ]; then
    bootstrap_content=$(cat "$bootstrap_skill" 2>/dev/null || echo "Error reading bootstrap skill")
else
    bootstrap_content="ghost skills plugin loaded but bootstrap skill not found."
fi

# Combine session message with bootstrap skill injection
bootstrap_escaped=$(escape_for_json "$bootstrap_content")
session_escaped=$(escape_for_json "$session_message")

context="${session_escaped}\n\n${bootstrap_escaped}"

# Output context injection as JSON.
# Cursor hooks expect additional_context (snake_case).
# Claude Code hooks expect hookSpecificOutput.additionalContext (nested).
# Copilot CLI (v1.0.11+) and others expect additionalContext (top-level, SDK standard).
# Claude Code reads BOTH additional_context and hookSpecificOutput without
# deduplication, so we must emit only the field the current platform consumes.
#
# Uses printf instead of heredoc to work around bash 5.3+ heredoc expansion bug.
if [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
    # Cursor sets CURSOR_PLUGIN_ROOT (may also set CLAUDE_PLUGIN_ROOT)
    printf '{\n  "additional_context": "%s"\n}\n' "$context"
elif [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -z "${COPILOT_CLI:-}" ]; then
    # Claude Code sets CLAUDE_PLUGIN_ROOT without COPILOT_CLI
    printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$context"
else
    # Copilot CLI (sets COPILOT_CLI=1) or unknown platform - SDK standard format
    printf '{\n  "additionalContext": "%s"\n}\n' "$context"
fi

exit 0
