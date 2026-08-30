# Recorded the first harness load test and fixed the bootstrap path defect it found

**UTC:** 2026-08-30 · **Actor:** agent session, author present and directing

## Context

The skills surface was packaged earlier today with no recorded load test, and
the README said so rather than claiming compatibility. This entry records the
first test and what it found.

## The test

`hooks/session-start.sh` was run three times with the environment each harness
family sets, checking the context JSON shape:

| Environment | Expected field | Result |
|---|---|---|
| `CLAUDE_PLUGIN_ROOT` set | `hookSpecificOutput.additionalContext` | pass |
| `CURSOR_PLUGIN_ROOT` set | `additional_context` | pass |
| neither (SDK standard) | `additionalContext` | pass |

## The defect it found

All three shapes were correct, and all three carried the string "bootstrap skill
not found" instead of the rules. Cause: the template was generated from the d7r
Skills repo with an ordered `sed`, and the rule rewriting `d7r-skills` ran first,
consuming the tail of `d7r-using-d7r-skills` and leaving `d7r-using-__SLUG__-skills`.
The broken path propagated into this repo as `d7r-using-ghost-skills` across
`hooks/session-start.sh`, `.opencode/plugins/ghost-skills.js` (two sites), and
`.opencode/INSTALL.md`.

This is a silent runtime failure by construction: the plugin loads, the hook
succeeds, and the agent receives a not-found notice where its rules should be.
Nothing in the validator would have caught it.

## The fix

1. Corrected the bootstrap path in all four sites here and in the template
   source (`skills/template/`), which had the same defect and would have seeded
   it into every future repo.
2. Added a bootstrap-path check to `tools/validate-skills.mjs` and to the d7r
   Skills repo validator: the path named in the session-start hook and in the
   OpenCode plugin must equal the bootstrap skill directory that exists.

## Verification

- `bash hooks/session-start.sh` with `CLAUDE_PLUGIN_ROOT` set now injects the
  bootstrap frontmatter and body; grep for "Absolute rules" in the injected
  context returns 1.
- `node tools/validate-skills.mjs`: 4 skills ok, versions 0.1.0 in lockstep,
  bootstrap path resolves.
- `bash scripts/ci.sh`: GATE PASS (secrets node data docs site).
- d7r Skills repo `npm run validate`: passed, 8 skills, with the same new check.

## Open risks

- This test exercises the hook's own logic, not a real harness install. The
  README's claim stays bounded to what was tested: no install-level compatibility
  claim is made for any of the seven harnesses.

## Next action

Author: install-level test on Claude Code plus one other harness, then the
README line can name what was verified and at which version.
