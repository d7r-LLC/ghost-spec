#!/usr/bin/env bash
# The gate. The only definition of passing for this repository.
# Usage: scripts/ci.sh [lane ...]   lanes: secrets node data docs site
# Every missing tool is a named failure, never a silent skip.
set -uo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root" || exit 1

fails=()
note() { echo "== $1"; }
fail() { fails+=("$1"); echo "FAIL: $1"; }

lane_secrets() {
    note "secrets: gitleaks"
    if command -v gitleaks >/dev/null 2>&1; then
        gitleaks detect --source . --config .gitleaks.toml --no-banner --redact || fail "secrets: gitleaks found leaks"
    else
        fail "secrets: gitleaks is not installed (brew install gitleaks)"
    fi
}

lane_node() {
    note "node: syntax"
    for f in scripts/*.mjs tools/*.mjs; do
        [ -e "$f" ] || continue
        node --check "$f" || fail "node: syntax $f"
    done
    note "node: tests"
    if compgen -G "tools/tests/*.test.mjs" >/dev/null; then
        node --test tools/tests/*.test.mjs || fail "node: tests"
    else
        fail "node: tools/tests has no *.test.mjs (a language without tests is unheld)"
    fi
    note "shell: shellcheck"
    if command -v shellcheck >/dev/null 2>&1; then
        shellcheck scripts/*.sh || fail "shell: shellcheck"
    else
        fail "shell: shellcheck is not installed (brew install shellcheck)"
    fi
}

lane_data() {
    note "data: examples validate against schemas"
    node tools/validate.mjs --all || fail "data: example validation"
}

lane_docs() {
    note "docs: record structure"
    node tools/check-record.mjs || fail "docs: record structure"
    note "docs: spec lint"
    node tools/spec-lint.mjs || fail "docs: spec lint"
    note "docs: conformance register fresh"
    node tools/extract-requirements.mjs --check || fail "docs: conformance register drifted from spec"
    note "docs: skills surface (d7r skills repository standard)"
    node tools/validate-skills.mjs || fail "docs: skills surface"
}

lane_site() {
    note "site: build"
    npm run --silent build || fail "site: build"
}

lanes=("$@")
[ ${#lanes[@]} -eq 0 ] && lanes=(secrets node data docs site)
for lane in "${lanes[@]}"; do
    case "$lane" in
        secrets) lane_secrets ;;
        node) lane_node ;;
        data) lane_data ;;
        docs) lane_docs ;;
        site) lane_site ;;
        *) fail "unknown lane: $lane" ;;
    esac
done

if [ ${#fails[@]} -gt 0 ]; then
    echo "GATE FAIL: ${#fails[@]}"
    printf ' - %s\n' "${fails[@]}"
    exit 1
fi
echo "GATE PASS (${lanes[*]})"
