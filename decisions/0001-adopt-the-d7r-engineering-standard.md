# 0001: adopt the d7r engineering standard

**Status:** accepted · **Decided:** 2026-08-30 · **Enforced by:** `scripts/ci.sh` (all lanes); record structure by `tools/check-record.mjs`

## Context

The repository published a spec with no steering, no gate, no record, and no
implementation surface, while its own README named the blocker ("conformance claims
are premature until the schemas exist"). The author directed adoption of the
standards established in `d7r-cto` before any implementation code.

## Decision

Adopt the d7r engineering standard as written in `d7r-cto/docs/ENGINEERING-STANDARD.md`,
adapted to this repository's languages (Node ESM, shell, JSON, Markdown) in
`docs/ENGINEERING-STANDARD.md`: one gate (`scripts/ci.sh`, lanes
`secrets node data docs site`), steering twins (`CLAUDE.md` = `AGENTS.md`), the
append-only minted log, numbered decisions with named enforcement, and designs and
plans in `docs/plans/`.

## Consequences

- Every future language or dependency addition carries a gate and steering in the
  same commit, and a human approves the dependency.
- Generated surfaces (register, site, validated examples) are gate-checked, so docs
  staleness is a red gate rather than drift.
- One open sub-question is deliberately not settled here: the license posture for
  code files in a CC BY 4.0 spec repo. Files carry the copyright line; whether code
  gains a code license (as in `d7r-cto`, Apache-2.0) is the author's call.

## Alternatives considered

- **Adopt nothing and build tools directly.** Fastest to first code; rejected
  because the author's directive was standards first, and because `d7r-cto`'s log
  records six defects its gates found in code that was "passing" before them.
- **Port the flowstate-platform monorepo standards** (husky, lint-staged, Nx).
  Rejected: heavier than a one-package repo needs, and the d7r estate's own standard
  already exists and is the stated exemplar.

## Enforcement

`scripts/ci.sh` is the only definition of passing; `.github/workflows/ci.yml` runs it
and nothing else. `tools/check-record.mjs` enforces log and decision structure.
`tools/spec-lint.mjs` enforces the em-dash and absolute-path bans and that the
steering twins are byte-identical.

## Source

Author direction, 2026-08-30 session (recorded in the vault's GHOST Protocol project
log); `d7r-cto/decisions/0001-every-language-gets-a-gate-and-steering.md`;
`d7r-cto/decisions/0002-scaffold-inherits-libraries-depend.md` (the bucket rule,
which is why this repo copies the scaffold rather than depending on it).
