# tools

Small Node ESM programs; each does one thing and exits loudly. No build step.

- `extract-requirements.mjs`: the conformance register (see conformance/README.md)
- `validate.mjs`: artifacts against schema/v1
- `check-record.mjs`, `spec-lint.mjs`: gate checks (see CLAUDE.md)
- `tests/`: node --test suites and fixtures; a fixture that must fail is as
  important as one that must pass
