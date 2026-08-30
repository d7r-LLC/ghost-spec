# Skills

The official agent skills for executing the GHOST protocol. Each skill is a
directory holding one `SKILL.md` with YAML frontmatter:

```yaml
---
name: ghost-protocol
description: Use when <conditions> - <what it provides>
metadata:
  spec_sections: "3, 4, 5"
  source_version: "1.0-draft"
---
```

The frontmatter shape follows the d7r skills repository standard: `name` and
`description` required, one optional `metadata` mapping, nothing else. The
library installs as `ghost-skills@ghost-spec` (see the README); the bootstrap
skill is `ghost-using-ghost-skills`, and `tools/validate-skills.mjs` enforces
the surface in the gate.

Rules:

- A skill interprets `spec/`; it never contradicts it, and it cites sections by
  number so a spec change can be traced to the skills it touches.
- The honest frame travels (spec 5.5, GH-01): no skill instructs an agent to speak
  as a subject, fabricate attribution, or strip the frame from an output.
- Skills state operator gates explicitly. A skill never instructs an agent to take
  an act the spec reserves for the operator or subject (creation, rung changes,
  certification, publication).
- Generalized from the operating reference implementation (the author's governed
  brain); vault-specific paths and tool choices do not appear here. Where a concrete
  tool is illustrative, it is named as illustrative.

The site builder renders each skill at `/skills/<name>/` and an index at `/skills/`.
