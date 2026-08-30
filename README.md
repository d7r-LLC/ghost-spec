# GHOST

**Governed Honest Oversight of Simulated Thinkers**

An open specification for advisor projections: how a person's published thinking becomes a governed counselor, what a projection may never claim, how counsel is bounded, how a living person publishes a certified official counselor, and what governs projections of the non-living.

**Status: Draft, published for review.** Nothing here is adopted until the author accepts it. Draft schemas and a conformance register now exist; conformance claims remain premature until the author reviews the draft. Published at [ghost-spec.dev](https://ghost-spec.dev) under CC BY 4.0.

## The stack

```
Agent Bill of Rights (ABR)   what agents deserve
        |
      DERP                   what the runtime must provide
        |
      SAGA                   how an agent is represented
        |
      GHOST                  how a person is projected as counsel
```

ABR Right X (Fair Representation) is GHOST's certification backbone. SAGA's signed persona and skills layers are the official profile surface. DERP hosts a counselor that runs as an agent. The Blueprint family governs a counselor operating inside a brain (RETAIN for whose state, DEFER for the terminal control: a counselor recommends, never decides).

## Contents

- `spec/GHOST-v1.0.md`: the specification draft (normative; nothing else is)
- `schema/v1/`: draft JSON Schemas for the five artifacts the spec names
- `conformance/`: the requirement register, extracted from the spec's RFC 2119 text
- `skills/`: official agent skills for executing the protocol
- `tools/`: validator, extractor, and gate checks
- `docs/`: engineering standard, plans, and the implementer's guide
- `examples/`: validated artifact examples (fictional subjects, on purpose)
- `site/`, `scripts/`: source and pipeline for [ghost-spec.dev](https://ghost-spec.dev), built by `npm run build`
- `rfcs/`: reserved for a public change process
- `CLAUDE.md` / `AGENTS.md`: the working contract; `scripts/ci.sh` is the gate

## Installing the skills

The `skills/` library installs as a plugin in any supported harness, per the d7r
skills repository standard. Install id: `ghost-skills@ghost-spec`.

- **Claude Code**: `/plugin marketplace add d7r-LLC/ghost-spec` then
  `/plugin install ghost-skills@ghost-spec`
- **Codex CLI**: `/plugins`, search `ghost-skills`; or point your config at
  `.codex-plugin/plugin.json`
- **Cursor**: `/add-plugin ghost-skills`; or point Cursor at
  `.cursor-plugin/plugin.json`
- **Gemini CLI**: `gemini extensions install https://github.com/d7r-LLC/ghost-spec`
- **OpenCode**: see [`.opencode/INSTALL.md`](.opencode/INSTALL.md)
- **GitHub Copilot CLI**: `copilot plugin marketplace add d7r-LLC/ghost-spec` then
  `copilot plugin install ghost-skills@ghost-spec`
- **Factory Droid**: `droid plugin marketplace add https://github.com/d7r-LLC/ghost-spec`
  then `droid plugin install ghost-skills@ghost-spec`

Cross-provider parity rule: a change to skills, hooks, or manifests must work on
every harness above; no compatibility claim is made without a recorded test at a
stated version. Verified so far: none recorded (the surface is new; the claim
waits for the test).

## The one-sentence thesis

A ghost is a projection of someone who is not present; GHOST makes the projection honest, bounded, and, where the subject is alive and willing, certified by their own signature.

---

Copyright (c) 2026 d7r LLC. Contact: hello@d7r.io
