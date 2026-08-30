# Conformance

The requirement register for GHOST, on the pattern established in `d7r-cto`'s
conformance instrument. **The spec is draft and this register is an instrument for
finishing it**, not a claim about anyone's implementation.

- `requirements.json`: every RFC 2119 sentence of `spec/GHOST-v1.0.md`, extracted by
  `tools/extract-requirements.mjs`. Do not hand-edit the `id`, `section`, `level`, or
  `text` fields; they are the spec's words. **`status` is the only writable field**:
  `unimplemented | implemented | verified | spec-defect | not-applicable`, and a
  status change names its evidence in `log/`.
- `SUMMARY.md`: generated counts. Do not edit.
- The gate re-extracts and diffs on every run, so a spec edit that changes normative
  sentences turns the gate red until the register is regenerated and its statuses
  reviewed.

Known limitation, accepted and visible: extraction is heuristic over markdown prose.
A misparsed sentence is fixed in the extractor, never by editing the register's text.

No conformance claims are made from this register while the spec's own draft note
says claims are premature; the register measures coverage, the author rules on
claims.
