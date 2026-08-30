# Built the GHOST implementation surface: register, schemas, skills, docs pipeline

**UTC:** 2026-08-30 · **Actor:** agent session, author present and directing

## Context

Second entry of the build directed by the author (standards first, spec compliance
before code, docs as part of core steering). The vault's GHOST Protocol project is
the operating reference implementation; this repo publishes the generalized surface.

## What was built

- **Conformance register** (`conformance/`): `tools/extract-requirements.mjs`
  extracted 31 requirements from `spec/GHOST-v1.0.md` covering all 37 RFC 2119
  keyword uses outside the RFC 2119 declaration itself (verified by count: 42 raw
  minus 5 in the declaration sentence). Register fields are the spec's words;
  `status` alone is writable; the gate re-extracts and diffs on every run.
- **Schemas** (`schema/v1/`, draft): counselor-charter, corpus-manifest,
  creation-record, reliance-record, calibration-record; each description cites the
  sections it interprets; conditional requires encode GH-13 (projection needs a
  rights declaration) and the held-implies-hash manifest rule.
- **Validator** (`tools/validate.mjs`, ajv 8.17.1 + ajv-formats 3.0.1, pinned;
  dependency addition made under the author's live directive and noted here).
- **Examples** (`examples/`): a composite fictional subject ("The Quartermaster")
  so the repo's own examples honor the honest frame; five valid examples plus a
  must-fail fixture.
- **Tests** (`tools/tests/`): four, including the negative case. Test-first caught
  two real defects before they shipped: ajv strict mode rejecting the conditional
  requires (fixed with `strictRequired: false` and the reason on the line), and an
  off-by-one in the validator's argument filter that silently dropped the first
  file argument when `--schema` was absent.
- **Docs pipeline** (`scripts/build-site.mjs` v2): renders spec, `docs/guide/`, and
  three generated reference surfaces (conformance table from the register, schema
  reference from the schema files, skills index and pages from SKILL.md
  frontmatter), emits `dist/nav.json`; 9 pages. Freshness lives in the gate, not a
  prebuild hook, closing the hole observed in the flowstate docs package.
- **Skills** (`skills/`): `ghost-protocol` (the seven-phase pipeline with the
  evidence threshold, generalized from the vault's v0.2 including its pilot-earned
  rules: the identity floor cap, sub-threshold routing to collection, waiver
  recording), `ghost-counselor-creation` (draft-outside-the-live-seat rule, class
  rules, the §14 self test, the operator's act), `ghost-conformance` (register
  discipline, §13 health invariants, reliance and calibration records).
- README front door updated; `package.json` scripts (`build test gate extract
  validate`); Pages workflow path triggers extended to the new content sources.

## Verification

- `bash scripts/ci.sh`: **GATE PASS (secrets node data docs site)**; node tests 4
  pass 0 fail; 5 of 5 examples validate; register matches spec (31); site builds 9
  pages; spec-lint and check-record ok.
- `git diff --stat spec/`: no change to normative text.
- Nothing committed, nothing pushed: push deploys ghost-spec.dev and is the
  author's publication act.

## Open risks

- **Plan step 4 deviation, recorded as a waiver**: the landing page's hand-written
  spec-restating sections were not converted to a generated fragment; editing the
  hand-designed page risked brand breakage without the author. The drift risk the
  design named therefore remains open on `site/index.html`.
- The extractor's sentence splitting is heuristic; the count check above bounds the
  risk today, and the register README states the standing rule (fix the extractor,
  never the register text).
- The vault pipeline and the published `ghost-protocol` skill can drift; each names
  its source version, and reconciliation is a log-visible act, not automatic.

## Next action

Author decisions: review the design and plan; commit and push (publication); rule on
the code-license posture; review the draft schemas against the spec before anyone
calls them more than draft.
