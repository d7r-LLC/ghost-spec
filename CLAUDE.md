# ghost-spec: working guidance

This file and `AGENTS.md` are kept byte-identical. Edit one, copy it over the other
in the same change.

## What this repository is

The GHOST specification (Governed Honest Oversight of Simulated Thinkers) and its
official implementation surface: the published spec, JSON Schemas for the artifacts
the spec names, a conformance requirement register, agent skills for executing the
protocol, small tools, and the site generator for ghost-spec.dev. Copyright d7r LLC;
the spec is CC BY 4.0.

`spec/` is normative. Everything else in this repository interprets it and says so.

## Non-negotiable contract

Every one of these is a constraint on the work, not an aspiration.

1. **`spec/` is normative; nothing else is.** Schemas, skills, docs, and tools cite
   the spec by section number and never contradict it. Where an interpretation is
   required, the artifact names it as an interpretation.
2. **Status, version numbers, and tier definitions are author decisions.** No agent
   changes the spec's Status line, its version, or §11's tiers. A change request is a
   note to the author, not an edit.
3. **Never generate the em dash character** in any file: spec text, docs, code,
   comments, schemas, commit messages. Use a comma, colon, semicolon, parentheses,
   or a hyphen. Enforced by `tools/spec-lint.mjs` in the gate.
4. **No machine-absolute paths** in spec or docs text. A path that only exists on one
   person's machine is wrong everywhere else. Enforced by the same lint.
5. **RFC 2119 keywords are used exactly**: MUST, MUST NOT, SHOULD, SHOULD NOT, MAY,
   uppercase, and only when normative. The conformance register is extracted from
   these sentences, so a casual "must" in lowercase prose and a normative "MUST" are
   different things on purpose.
6. **Fail loudly.** A tool that cannot do its job exits non-zero and says what it
   could not do. Never return an empty success. `unknown` is a legal answer: a check
   that cannot determine a result records `unknown` with the reason, and never infers
   a result to fill a field. (This restates the spec's own §12/§13 posture; the tools
   must live by the rules the spec imposes on implementations.)
7. **The honest frame travels into every artifact here** (spec §5, failure class
   GH-01). Example charters, skills, and docs never present a counselor as a person,
   never fabricate a quote, and every example that names a real person is marked
   fictional or uses a composite. A repository teaching honest simulation must not
   itself contain a dishonest one.
8. **Evidence or nothing.** A claim in docs or a log entry names its source: a spec
   section, a command and its output, a file. "It passes" is not a report; name the
   command and its result. A skipped check is reported as skipped, never as passing.
9. **Docs are part of the change, not a follow-up.** A change to `spec/`, `schema/`,
   `skills/`, or `tools/` updates the affected documentation in the same commit and
   reruns the build. The gate's docs lane re-extracts the conformance register,
   validates every example, and rebuilds the site, so a stale generated surface is a
   red gate, not a surprise.

## The gate

`scripts/ci.sh` is the only definition of passing. Lanes: `secrets node data docs
site`; run one with `scripts/ci.sh <lane>`. Do not add a check to CI that is not in
it; do not add a check to it that CI does not run. Every missing tool is a named
failure, never a silent skip.

## The record

This repository keeps its own record; the planning brain plans, this repo records
what happened here.

- `log/`: append-only development log. Mint filenames only with
  `scripts/newlog.sh "short action"`. Never compute a name by listing the folder;
  that is a read-then-write race with a documented incident behind it.
- `decisions/`: numbered records, `NNNN-kebab-title.md`, with Status, Decided,
  Enforced-by. Enforcement is required, and `manual` is a legitimate but visible
  answer. Superseding never edits the old record beyond `superseded_by`.
- `docs/plans/`: designs and plans from the templates there, required for new tools,
  schemas, pipeline changes, and anything that writes to disk at runtime.

Structure of all three is enforced by `tools/check-record.mjs` in the gate.

## What needs a human

Changing the spec's Status, version, or tiers; making any conformance claim on
behalf of the spec or an implementation; tagging a release; anything that collects
data about a person.

Agent work without asking (Spencer, 2026-10-24): commits and pushes on a worktree
branch, pull requests merged once `scripts/ci.sh` passes, and exactly pinned
dependencies added with a recorded reason. Never push directly to `main`: a push to
`main` deploys ghost-spec.dev, so **merge is publication**.

## Directory contract

Every directory carries a README stating what may land in it. If a file does not fit
any directory's README, the answer is a design doc, not a new directory.

| Path | Holds |
|---|---|
| `spec/` | the normative specification, one file per major version |
| `schema/v1/` | draft JSON Schemas for GHOST artifacts, keyed to spec sections |
| `conformance/` | the requirement register extracted from the spec; `status` is the only hand-writable field |
| `skills/` | the official agent skills for executing the protocol; packaged per the d7r skills repository standard (planning repo, `docs/specs/2026-08-30-d7r-skills-repository-standard.md`): install id `ghost-skills@ghost-spec` |
| `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `.opencode/`, `gemini-extension.json`, `GEMINI.md`, `hooks/` | the plugin surface; one version in lockstep across the six manifests, enforced by `tools/validate-skills.mjs` in the gate |
| `tools/` | small Node ESM programs; each does one thing and exits loudly |
| `docs/` | authored documentation; `docs/plans/` designs and plans |
| `examples/` | artifact examples validated by the gate; fictional subjects only unless marked |
| `scripts/` | the gate, the log minter, the site builder |
| `site/`, `dist/` | hand-written landing shell; generated output (ignored) |
| `rfcs/` | reserved for a future public change process |

## Conventions

- Node ESM, no build step, no framework. Dependencies are pinned exactly; record why
  each one is added. Prefer the standard library.
- Shell scripts: `#!/usr/bin/env bash`, `set -euo pipefail`, shellcheck-clean.
- Conventional commits, `type(scope): description`, no em dashes in messages.
- JSON data files: 2-space indent, LF, trailing newline, no comments.
- Tests use `node --test`; a fixture that must fail is as important as one that must
  pass.

<!-- d7r:git-workflow:start -->
## Git workflow (d7r, binding; synced from the planning repo, do not edit here)

- Resolve the actual canonical path and Git worktree before writing. The canonical checkout must stay on `main` as an update-only mirror of current `origin/main`, even if older guidance names a feature branch or `origin/HEAD`. Never edit files, commit, switch branches, install dependencies or run writing builds there.
- Do all work in a worktree: `~/code/d7r/scripts/d7r-worktree new <repo> <type>/<slug>` creates `<repo>/.worktrees/<slug>` from freshly verified `origin/main`. Types: feat, fix, docs, chore, refactor, test, ci, rescue. Never use `/tmp`, `~/Documents`, `~/.codex/worktrees` or `.claude/worktrees`.
- Preflight branch, HEAD, origin URL, main/upstream relation, tracked/untracked files, worktrees, locks, task owners and runtime dependencies. Cached refs do not prove "latest". Any agent may fast-forward a clean, unowned canonical main (`git merge --ff-only origin/main`) after live origin/main verification; no owner review is needed. Stop canonical updates on dirt, divergence, wrong branch, missing main, active owner/runtime or uncertain ownership; preserve an exact handoff. Never auto-merge, reset, clean, auto-stash, force-update or move another session's worktree to normalize it.
- Repository policy overrides skills or old examples that edit the starting checkout, branch from its HEAD or use another worktree location. A non-main canonical checkout requires an explicitly scoped preservation and restoration handoff, not an automatic checkout.
- Push every commit: `git push -u origin <branch>` the first time, `git push` after, then confirm the remote ref equals `HEAD`. A local commit is not a backup.
- Open a draft pull request on the first push, stating purpose, scope and the plan or spec link. Do not prefix titles with "WIP"; Forgejo refuses to merge them. Pass `fj` the d7r Forgejo host with `-H` and use the qualified `d7r/<repo>#<n>` form.
- Merge and release authority (Spencer, 2026-10-24): merge your own pull request once its required checks pass, and change staging, without asking; merge `origin/main` in first when the branch is behind. Production releases run only through CI under planning decision 0077: a release that applies a database migration waits for Spencer's explicit approval, and until this repository passes its staging rollback drill its production releases keep its earlier rule. Older text in this repository that asks for approval of a merge, a staging change or a non-migration release is superseded.
- Hooks run through the d7r dispatcher: main-checkout guard, Gitleaks, then this repository's own hooks. Never skip them, force-push or rewrite pushed history.
- Verify the provider identity before pushing: `d7radmin` on Forgejo, the d7r-LLC identity on GitHub.
- Preserve existing ignored runtime state and unknown files during an audit or handoff; an ignored path is not permission to delete it. Secrets live in 1Password.
- After merging a pull request, remove its worktree: `~/code/d7r/scripts/d7r-worktree finish <path>`, run from outside the worktree. It removes the worktree and its local branch only when the branch is merged into `origin/main`, the tree is clean and no process is working inside it. An hourly job removes any merged worktree left behind.
- The sweep reports canonical checkouts that are behind; it does not advance them. Any agent may apply that fast-forward under the rule above. Its separate cleanup mode removes worktrees that are clean, pushed, unlocked and not in use, once they are merged or idle for 48 hours. Protect one with `git worktree lock <path>`.
- Full policy: `docs/development-workflow.md`, section "Worktree lifecycle", in the d7r planning repository (decision 0075).
<!-- d7r:git-workflow:end -->
