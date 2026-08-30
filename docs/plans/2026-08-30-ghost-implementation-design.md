# GHOST implementation surface: design

**UTC:** 2026-08-30 · **Status:** draft, executing by author direction

## The problem

The repository publishes a spec and nothing else. Its own README concedes the
blocker: "Conformance claims are premature until the schemas exist." There is no
steering document, no engineering gate, no record (log or decisions), no schemas, no
conformance instrument, no skills, and no tools; the docs pipeline renders exactly
one file; CI deploys without verifying anything. The author has directed: full
documentation and agent skills for GHOST implementation, an official skill and tools
that can execute the spec, a dynamic documentation system, docs maintained as part of
core steering, and d7r spec compliance machinery, all to the standards established in
`d7r-cto`.

## Constraints

1. **`spec/` is normative and author-gated** (CONTRIBUTING rules 1 and 4). Nothing in
   this build edits the spec's Status, version, or tiers.
2. **The d7r engineering standard** (`d7r-cto/docs/ENGINEERING-STANDARD.md`): every
   language gets a gate and steering in the same commit; one gate mirrored exactly;
   secrets checked first; test-first; the repo keeps its own record; verification
   names its command.
3. **The d7r development-workflow mandate**: generic versus project-specific is
   decided before code. This repo is not a template descendant; its tooling is
   spec-repo-specific today, but the doc-generation shape should be extractable to
   the sibling spec repos later (see What this does not do).
4. **No em dash** anywhere; no machine-absolute paths in spec or docs text.
5. **Push is publication.** `main` auto-deploys ghost-spec.dev. Everything here lands
   uncommitted; commit and push are the author's acts.
6. GHOST's own clauses bind the tools: fail loudly, `unknown` is a legal answer,
   evidence or nothing (adopted verbatim from the d7r-cto contract because they are
   restatements of the spec's own §12 and §13 posture).

## Options considered

### Option A: port the flowstate docs application

Next.js + Markdoc + FlexSearch, the full `packages/docs` shape. The case for it: a
proven system, search, App Router routing, an agent-facing llms.txt surface, and the
author pointed at it as the reference. It would make ghost-spec.dev a rich site.

### Option B: extend the existing zero-framework generator

Grow `scripts/build-site.mjs` into a small pipeline: discover markdown under `spec/`
and `docs/`, generate reference pages from machine sources (schemas, the conformance
register, skill frontmatter), emit a navigation manifest, render everything through
`marked` into `dist/`. The case for it: the repo already works this way; one pinned
dependency; the Pages workflow stays untouched; the flowstate report's own "minimum
viable version" is exactly this shape; and a spec site's content is a dozen pages,
not a product's documentation estate.

## The choice, and why

**Option B**, taking from flowstate the *shape* (discover, normalize, generate,
navigation manifest, generated output ignored by git) and from d7r-cto the
*enforcement* (freshness and correctness live in the single gate, not in a prebuild
hook; the flowstate report documents that its prebuild-only trigger silently skips on
the deploy path, and this design closes that hole by construction). Option A's
framework weight buys search and theming this content volume does not need, and adds
a build surface the gate would then have to defend.

Companion choices, each mirroring a named precedent:

- **Conformance register** on the `d7r-cto/conformance/` pattern: requirements
  extracted from the spec's RFC 2119 sentences into `conformance/requirements.json`
  (`{id, section, level, text, status}`), where the text fields are the spec's words
  and `status` is the only writable field. The gate re-extracts and diffs text so the
  register cannot drift from the spec silently.
- **Schemas** in `schema/v1/` for the five artifact kinds GHOST 4, 6, and 7 name:
  counselor charter, corpus manifest, creation record, reliance record, calibration
  record. Draft status, validated examples, spec-section pointers in descriptions.
- **Skills** in `skills/` as the official execution surface: the protocol pipeline,
  counselor creation, and conformance/self-test, generalized from the operating
  reference implementation (the author's brain vault) with vault-specific bindings
  removed.
- **Tools** in `tools/` as small Node ESM programs: requirement extraction, artifact
  validation against the schemas (ajv, pinned), self-test checklist emission and
  record checking, plus the gate's own checkers (record structure, spec lint).
- **Docs as core steering**: the steering twins require that a change to `spec/`,
  `schema/`, `skills/`, or `tools/` updates the affected docs in the same commit, and
  the gate's docs lane makes the generated surfaces impossible to forget: it rebuilds
  and fails on error, re-extracts the register and fails on drift, and validates
  every example against its schema.

## How it fails

- **The extractor misparses spec prose** (a MUST inside a table or quote) and the
  register is wrong with confidence. Mitigated: extraction is deterministic and
  line-anchored, the gate diff catches spec edits, and the register README carries
  the d7r-cto rule that text fields are never hand-edited; misparses are fixed in the
  extractor, visibly. Residual risk accepted and stated in `conformance/README.md`.
- **The landing page drifts from the spec** (it restates persona classes and tiers by
  hand). Silent today. Mitigated partially: the rebuilt site regenerates `/spec/`
  from Markdown; the landing page gains a generated-fragment include for the sections
  that restate spec content. What remains hand-written is marked as such.
- **Schemas ossify a draft spec.** The spec is Draft; schemas are marked draft and
  carry the spec version they interpret. A spec change that invalidates a schema is
  caught by the register diff, not by the schema itself; that gap is stated, not
  hidden.
- **Skills drift from the vault's living pipeline.** The vault remains the operating
  reference; the repo's skills are the published generalization. Divergence is
  managed by the log (each skill names its source version), not by automation.

## What this does not do

- No search, no framework, no client-side navigation. If the docs estate outgrows a
  sidebar manifest, revisit Option A then.
- No extraction of the generator for the sibling spec repos yet. The trigger, per the
  d7r-cto bucket rule, is the first consumer outside this repo; until then the
  generic-versus-specific answer is "specific, built extractably".
- No commits, no pushes, no releases, no git tags: author acts.
- No change to spec text beyond none at all; the CONTRIBUTING stale-status line is
  the one repo-text correction proposed, and it is listed in the plan as its own step
  so it is visible.
- No conformance *claims*. The register measures; the spec's own draft note says
  claims are premature until the author reviews and the schemas exist. The schemas
  existing does not itself close that; the author does.
