# GHOST implementation surface: plan

**UTC:** 2026-08-30 · **Design:** [2026-08-30-ghost-implementation-design.md](2026-08-30-ghost-implementation-design.md) · **Status:** in-progress

## Stages

- [x] Design written (executing by author direction; author review of both documents
  is an open item and recorded as such rather than assumed)
- [x] Plan written
- [ ] Executed test-first where a test can exist before the code (gate checks are the
  tests for scaffold steps; waiver: directory READMEs and prose docs have no
  meaningful failing-first test and are verified by the record checker instead)
- [ ] Reviewed
- [ ] Verification (named commands below, results recorded in `log/`)

## Steps

### 1. Standards scaffold (the layer0 port, Node-shaped)

- **Test first:** `bash scripts/ci.sh` fails before the scaffold exists (no script);
  observed: yes, the file is absent.
- **Acceptance:** gate runs with lanes `secrets node data docs site`, every missing
  tool a named failure; `scripts/newlog.sh` mints atomically; record checker enforces
  log and decision structure.
- **Files:** `CLAUDE.md` + `AGENTS.md` (byte-identical), `docs/ENGINEERING-STANDARD.md`,
  `scripts/{ci.sh,newlog.sh}`, `tools/{check-record.mjs,spec-lint.mjs}`,
  `.editorconfig`, `.gitleaks.toml`, `log/README.md`, `decisions/README.md`,
  `decisions/0001-adopt-the-d7r-engineering-standard.md`, per-directory READMEs,
  `.github/workflows/ci.yml`, `CONTRIBUTING.md` stale-status fix, `package.json`
  scripts.

### 2. Conformance register

- **Test first:** `node tools/extract-requirements.mjs --check` fails with no
  register on disk.
- **Acceptance:** `conformance/requirements.json` holds every RFC 2119 sentence of
  `spec/GHOST-v1.0.md` with `{id, section, level, text, status:"unimplemented"}`;
  `conformance/SUMMARY.md` generated; gate lane `docs` re-extracts and diffs.
- **Files:** `tools/extract-requirements.mjs`, `conformance/{README.md,requirements.json,SUMMARY.md}`.

### 3. Schemas and examples

- **Test first:** `node tools/validate.mjs examples/...` fails before schemas exist.
- **Acceptance:** five draft schemas in `schema/v1/` (charter, corpus manifest,
  creation record, reliance record, calibration record), each keyed to spec sections;
  one valid example per schema in `examples/`; gate validates all examples; an
  invalid fixture is rejected (negative test).
- **Files:** `schema/v1/*.schema.json`, `examples/*.json`, `tools/validate.mjs`,
  `package.json` (+ ajv, pinned).

### 4. Docs pipeline v2

- **Test first:** `npm run build` currently renders one page; acceptance test is the
  page count and manifest existence, which fail against the old builder.
- **Acceptance:** builder discovers `spec/` and `docs/`, generates reference pages
  from the register, the schemas, and skill frontmatter, emits
  `dist/nav.json` and renders all pages with the existing template and nav; site lane
  green; landing page's spec-restating sections come from a generated fragment.
- **Files:** `scripts/build-site.mjs` (extended), `docs/*.md` seeds
  (implementers-guide, glossary pointer), `site/index.html` (fragment markers only).

### 5. Skills

- **Acceptance:** `skills/README.md` plus three skills, each a `SKILL.md` with
  frontmatter (`name`, `description`, `spec_sections`, `source_version`):
  `ghost-protocol` (the full execution pipeline, phases 0 to 6, confidence rubric,
  operator gates), `ghost-counselor-creation` (GHOST 4 creation act, charter shape,
  §14 self test), `ghost-conformance` (register maintenance, health invariants §13,
  self-test records). Generalized: no vault paths, no tool lock-in, honest-frame and
  terminal-control rules restated from the spec by section number.
- **Files:** `skills/README.md`, `skills/*/SKILL.md`.
- **Waiver:** prose artifacts; the test is spec-lint (em dash, absolute paths,
  RFC 2119 misuse) plus the build rendering them.

### 6. Record and handoff

- **Acceptance:** first two log entries minted with `newlog.sh` (standards adopted;
  implementation surface built), decision 0001 recorded, gate green end to end,
  nothing committed; a summary of author decisions still open (commit/push, license
  posture for code files, CONTRIBUTING fix approval, spec review).

## Verification

Named at execution time in `log/`; the closing check is one full `bash scripts/ci.sh`
with every lane listed and its result.

## Rollback

Nothing is committed; `git clean -fd && git checkout -- .` restores the published
state exactly. The spec file is untouched throughout (verified by `git diff --stat`
showing no `spec/` change).
