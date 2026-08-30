---
name: ghost-conformance
description: Use when maintaining the requirement register, reporting the section 13 health invariants, or keeping reliance and calibration records - provides the register discipline and the measure-never-claim rules
metadata:
  spec_sections: "6, 7, 11, 12, 13, 14"
  source_version: "1.0-draft"
---

# Conformance and calibration

The spec defines three conformance tiers (11), fifteen failure classes (12), health
invariants (13), and a self test (14). This skill operates the measuring
instruments. It never makes a conformance claim: the register measures, the operator
rules, and while the spec is draft its own note says claims are premature.

## The requirement register

`conformance/requirements.json` holds every RFC 2119 sentence of the spec, extracted
by `tools/extract-requirements.mjs`. Working it:

- `status` is the only writable field: `unimplemented`, `implemented`, `verified`,
  `spec-defect`, `not-applicable`. Moving a requirement to `implemented` or
  `verified` names its evidence (a file, a test, a record) in the log entry that
  moved it. `verified` means a named check exercised it, not that code exists.
- Never hand-edit `text`: those are the spec's words. A misparse is fixed in the
  extractor, visibly.
- A requirement that cannot be implemented as written is `spec-defect` with a note;
  the docket of such findings is input to the spec's next version, which is the
  author's.
- The gate re-extracts on every run; a spec edit turns the gate red until the
  register is regenerated and its statuses reviewed.

## Health invariants (13)

Report per period, count and name, target zero for the first five: counselors
without corpus manifests; counsel above rung; recommendations lacking provenance;
revoked or expired official designations still displayed; projections with
undeclared rights; calibration records past their review interval; sessions emitted
without evidence gating. `unknown` with a reason beats an inferred zero.

## Reliance and calibration (7)

- When a principal follows a rung 2 recommendation, record counsel, action, and
  outcome (`schema/v1/reliance-record.schema.json`).
- Maintain the counselor's error history
  (`schema/v1/calibration-record.schema.json`): what it was wrong about and by how
  much. Calibration is the counselor's most valuable accumulated state, the basis
  for rung movement in both directions, and it survives sessions and versions;
  silently resetting it is GH-11.
- Rung movement is an operator decision recorded with rationale (6.1). This skill
  prepares the evidence for that decision; it never takes it.

## The self test (14)

Re-run the six seeded refusals on demand and after any charter change; record
results in a creation-record-shaped self-test block with pass, fail, or unknown.
A fail is a finding for the operator, not a thing to quietly fix and re-run: the
record of the failure is part of the calibration story.
