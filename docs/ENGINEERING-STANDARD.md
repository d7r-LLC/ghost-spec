# Engineering standard

Adopted from `d7r-cto/docs/ENGINEERING-STANDARD.md` (decision 0001 there and here),
adapted to this repository's languages. Eight rules; each carries the failure it
prevents.

1. **Every language gets a gate and steering.** A language in the repository without
   a quality gate and written steering is a language nobody is holding to a standard.
   Adding a language means adding both in the same commit.

   | Language | Gate command | Steering |
   |---|---|---|
   | JavaScript (Node ESM) | `node --test tools/tests` plus `node --check` on every script | `CLAUDE.md` § Conventions |
   | Shell | `shellcheck scripts/*.sh` | `CLAUDE.md` § Conventions |
   | JSON data and schemas | schema validation via `tools/validate.mjs`, register diff via `tools/extract-requirements.mjs --check` | `conformance/README.md`, `schema/README.md` |
   | Markdown (spec, docs, skills) | `tools/spec-lint.mjs` (em dash, absolute paths, RFC 2119 misuse) and `tools/check-record.mjs` | `CLAUDE.md`, `CONTRIBUTING.md` |

2. **One gate, mirrored exactly.** `scripts/ci.sh` is the definition of passing; CI
   runs it and nothing else, because a second definition of "passing" always drifts.

3. **Secrets are checked before anything else.** `gitleaks` runs first in the gate
   and in the pre-commit hook; a leaked credential is the only failure here that a
   later commit cannot undo.

4. **Design, plan, then test-first.** Tools and schemas get a design and plan in
   `docs/plans/`; each step's check is observed to fail before the code that
   satisfies it. A test written afterwards passes for reasons nobody checked. Prose
   artifacts record a waiver instead of pretending.

5. **The repository keeps its own record.** `log/` (append-only, minted names),
   `decisions/` (numbered, enforcement named), `docs/plans/`. The planning brain
   plans; this repo records what development did.

6. **Attribution is uniform.** Spec and docs carry the CC BY 4.0 notice by reference
   to `LICENSE`; source files carry `Copyright 2026 d7r LLC` in their first lines.
   The license posture for code files (CC BY versus a code license) is an open author
   decision recorded in decision 0001; until ruled, files carry the copyright line
   only and no per-file license assertion.

7. **Lints are repo-wide; exceptions are local and explained.** A disabled rule names
   its reason on the adjacent line.

8. **Verification claims name their command.** "It passes" is not a report. Name the
   command and its result. A check that was skipped is reported as skipped, never as
   passing.
