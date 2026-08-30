#!/usr/bin/env bash
# Mint an append-only log entry path atomically and print it.
# Usage: scripts/newlog.sh "short action description"
# Format matches the d7r estate convention: YYYYMMDDTHHMMSSZ-<10 hex>-<slug>.md
# Never compute a name by listing the folder and picking max+1: that is a
# read-then-write race (three concurrent sessions each picked 087 once).
set -euo pipefail

if [ $# -lt 1 ] || [ -z "$1" ]; then
    echo "usage: $0 \"short action description\"" >&2
    exit 1
fi

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
log_dir="$repo_root/log"
mkdir -p "$log_dir"

slug=$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -e 's/[^a-z0-9]\{1,\}/-/g' -e 's/^-//' -e 's/-$//' | cut -c1-60)
stamp=$(date -u +%Y%m%dT%H%M%SZ)

for _ in 1 2 3 4 5; do
    entropy=$(od -An -N5 -tx1 /dev/urandom | tr -d ' \n')
    path="$log_dir/${stamp}-${entropy}-${slug}.md"
    if (set -o noclobber; : > "$path") 2>/dev/null; then
        echo "$path"
        exit 0
    fi
done

echo "could not mint a unique log path after 5 attempts" >&2
exit 1
