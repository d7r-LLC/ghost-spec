---
name: ghost-using-ghost-skills
description: Use when starting any conversation that touches GHOST counselors, advisor projections, or this repository - establishes the skill catalog, the absolute rules from the spec, and which skill to reach for
metadata:
  spec_sections: "1, 5, 6"
  source_version: "1.0-draft"
---

# Using GHOST skills

The GHOST specification governs how a person's published thinking may be
projected as counsel. These skills execute it. `spec/GHOST-v1.0.md` is normative;
every skill cites the sections it interprets, and where a skill and the spec
disagree, the spec wins and the skill is the thing that is wrong.

## Absolute rules

Each is a spec invariant, not a preference; the failure class it prevents is
named.

1. **Never speak as a subject, never fabricate a quote, anecdote, statistic, or
   biographical detail attributed to one** (spec 5; GH-02, GH-05). A counselor is
   a lens; so are you when you draft one.
2. **Agents draft; operators decide.** Creation, rung changes, certification,
   revocation, publication, and every action taken on counsel are human acts
   (spec 4.1.3, 6.1, 6.5, 8; GH-09). A skill that would let you take one is being
   misread.
3. **No manifest, no recommendations** (spec 4.1.1; GH-06, GH-08). A counselor
   without an enumerated corpus cannot support advice provenance.
4. **No evidence, no counsel** (spec 6.3; GH-14). With no record of the
   principal's to read, the correct output is a refusal that says so.
5. **A living subject's simulated counselor is private, always** (spec 3.2.1;
   GH-12). Never published, sold, distributed, or exported.
6. **`unknown` is a legal answer.** A check that cannot determine a result
   records `unknown` with the reason; never infer a result to fill a field.

## Catalog

| Skill | When to use |
| --- | --- |
| `ghost-protocol` | Use when taking a new subject through the full pipeline: qualification, discovery, collection, scoring against the evidence threshold, distillation, and expression |
| `ghost-counselor-creation` | Use when a subject is distilled and the operator wants a counselor: charter and manifest drafting, the section 14 self test, and the creation-act handoff |
| `ghost-conformance` | Use when maintaining the requirement register, reporting section 13 health invariants, or keeping reliance and calibration records |

## Dependency map

```
ghost-protocol
  phase 5 invokes -> ghost-counselor-creation
  phases 3 and 6 feed -> ghost-conformance (evidence ledger, register statuses)
ghost-conformance
  self test re-runs cite -> ghost-counselor-creation (the seeded prompts table)
```

Validation for this surface: `npm run validate:skills` (wired into the gate's
docs lane). The schemas the creation skill validates against live in
`schema/v1/`; the register lives in `conformance/`.
