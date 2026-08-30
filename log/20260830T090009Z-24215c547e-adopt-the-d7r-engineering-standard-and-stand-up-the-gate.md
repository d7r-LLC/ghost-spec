# Adopted the d7r engineering standard and stood up the gate

**UTC:** 2026-08-30 · **Actor:** agent session, author present and directing

## Context

The author directed full documentation and agent skills for GHOST implementation,
with the standards established in `d7r-cto` adopted first and d7r spec compliance
machinery in place before implementation code. Surveyed `d7r-cto` (steering twins,
single gate, minted log, decisions, conformance instrument), the sibling spec repos
(saga-standard, derp-spec), and the flowstate-platform docs package (the
discover-copy-generate-manifest shape, and its known freshness hole: a prebuild-only
trigger that deploy paths bypass).

## What was built

Design and plan: `docs/plans/2026-08-30-ghost-implementation-{design,plan}.md`.
Then the scaffold: `CLAUDE.md` and `AGENTS.md` (byte-identical twins),
`docs/ENGINEERING-STANDARD.md`, decision
`decisions/0001-adopt-the-d7r-engineering-standard.md`, `scripts/ci.sh` (lanes:
secrets node data docs site; every missing tool a named failure),
`scripts/newlog.sh` (atomic mint under noclobber), `tools/check-record.mjs`,
`tools/spec-lint.mjs` (em dash, machine-absolute paths, twins identity, spec Status
line; spec text em dashes would be notes, not failures, because agents may not edit
normative text to satisfy a lint), `.editorconfig`, `.gitleaks.toml` (estate rules:
anthropic-api-key, bearer-jwt), per-directory READMEs, `.github/workflows/ci.yml`
(runs the gate and nothing else), and the CONTRIBUTING stale-status fix
("unpublished draft" contradicted the published-for-review README since commit
31f7401).

## Verification

- `bash scripts/ci.sh`: GATE PASS (secrets node data docs site).
- `cmp CLAUDE.md AGENTS.md`: identical.
- `bash scripts/newlog.sh` minted this entry's path; two concurrent mints in one
  second produced distinct identifiers (24215c547e, 108bea29b1), which is the race
  the atomic mint exists to win.

## Open risks

- **Local versus CI toolchain drift**: the gate passed locally with gitleaks and
  shellcheck present; CI installs pinned gitleaks 8.18.4 and distro shellcheck, so
  the first CI run is the real proof.
- **License posture for code files** in a CC BY 4.0 repo is deliberately not
  settled; decision 0001 flags it for the author.

## Next action

Build the implementation surface on top of the standard (next entry).
