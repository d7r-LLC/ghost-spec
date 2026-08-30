# Plans

Design and plan documents for changes to this repository. The convention is adopted
from `d7r-cto` (decision 0001 there; decision 0001 here adopts it for this repo).

- `YYYY-MM-DD-<slug>-design.md` from `TEMPLATE-design.md`: the problem, constraints,
  at least two options each argued for honestly, the choice, how it fails, and what it
  does not do.
- `YYYY-MM-DD-<slug>-plan.md` from `TEMPLATE-plan.md`: stages, steps with the test
  named first and observed to fail, acceptance, files, verification, rollback.

A design and plan are required for: new tools, new schemas, changes to the spec's
build pipeline, changes to the conformance register format, and anything that writes
to disk at runtime. When unsure, write the design; it is shorter than the argument
about whether it was needed.

Spec text changes are governed separately: `spec/` is normative, and Status, version,
and tier definitions are author decisions (see `CONTRIBUTING.md` and `CLAUDE.md`).
