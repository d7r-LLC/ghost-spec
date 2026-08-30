# Packaged the skills surface per the d7r skills repository standard

**UTC:** 2026-08-30 · **Actor:** agent session, author present and directing

## Context

The author directed one setup and convention for plugin config and multi-harness
support documentation across all d7r skills repos, with a canonical template.
The standard: planning repo `docs/specs/2026-08-30-d7r-skills-repository-standard.md`;
the scaffold: d7r Skills repo `template/`. This repo is the first conversion.

## What was built

- Plugin surface from the scaffold: `.claude-plugin/` (plugin + self-hosting
  marketplace `ghost-spec`), `.codex-plugin/`, `.cursor-plugin/`,
  `.opencode/` (JS plugin + INSTALL), `gemini-extension.json` + `GEMINI.md`,
  `hooks/` (Claude family + Cursor session-start, polyglot wrapper). Install id
  `ghost-skills@ghost-spec`, version 0.1.0 in lockstep across six manifests.
- Bootstrap skill `ghost-using-ghost-skills`: absolute rules with failure
  classes, catalog table, dependency map.
- Frontmatter migrated to the standard: `name`, `description` (real "Use when"
  triggers), one `metadata` mapping carrying `spec_sections` and
  `source_version`. The site builder's frontmatter reader ignores nested keys,
  so rendered skill pages are unchanged.
- `tools/validate-skills.mjs` (from the scaffold, plugin-manifest slug
  derivation) wired into the gate's docs lane.
- README installation section for seven harnesses, with the parity rule and an
  honest "verified so far: none recorded" line; CLAUDE/AGENTS directory contract
  updated; `skills/README.md` frontmatter shape corrected.

## Verification

- `bash scripts/ci.sh`: GATE PASS (secrets node data docs site), including the
  new `docs: skills surface` check. Two SHOULD-band line-count notes reported
  (ghost-conformance 58, bootstrap 57), inside the 40 to 200 MUST bound.
- `node tools/validate-skills.mjs`: 4 skills ok, versions 0.1.0 in lockstep.
- `cmp CLAUDE.md AGENTS.md` clean via the gate's spec-lint identity check.

## Open risks

- No harness has a recorded load test yet; the README says so rather than
  claiming. First recorded test should be Claude Code plus one other.
- The install commands reference the GitHub repo; nothing is committed or
  pushed, so none of them work until the author publishes.

## Next action

Author: review, commit, push (publication); record the first harness load test.
