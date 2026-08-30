---
title: Implementer's guide
order: 1
description: What a GHOST implementation holds, which artifact each schema governs, and where the operator's decisions sit.
---

An implementation of GHOST is small on purpose: four artifact kinds, one register,
and a short list of acts only a human may take.

## The artifacts

| Artifact | Schema | Spec sections |
|---|---|---|
| Counselor charter | `schema/v1/counselor-charter.schema.json` | 3, 4.1, 5, 6, 9 |
| Corpus manifest | `schema/v1/corpus-manifest.schema.json` | 2, 4.1.1 |
| Creation record | `schema/v1/creation-record.schema.json` | 4.1.3, 14 |
| Reliance record | `schema/v1/reliance-record.schema.json` | 7.1, 6.2 |
| Calibration record | `schema/v1/calibration-record.schema.json` | 7.2, 7.3, 13 |

Validate any of them with `node tools/validate.mjs <file>`. The schemas are draft
interpretations of a draft spec and say so; where they interpret, the description
fields cite the section interpreted.

## The order of operations

1. **Qualify the subject** (4.2) and fix the persona class (3). The class decides
   most of what follows: a living subject's simulated counselor is private forever
   unless the official path is taken (3.2.1); a projection needs a rights
   declaration (4.1.5) and a closed corpus (9.2).
2. **Enumerate the corpus** before anything counsels: no manifest, no
   recommendations, ever (4.1.1).
3. **Create deliberately** (4.1.3): a recorded act, by the operator, with the self
   test (14) run and its results kept.
4. **Counsel under controls**: rung 0 by default (6.1), provenance on every
   recommendation (6.2), evidence gating (6.3), quorum and distinct voices (6.4),
   and the terminal control: a counselor recommends, it never decides (6.5).
5. **Keep the reliance and calibration records** (7): they are what make rung
   movement an evidenced decision instead of a mood.

## What only a human does

Creation, rung changes, certification, revocation handling, publication of anything,
and every action taken on counsel. An implementation that automates one of these has
not implemented the spec; it has routed around it.

## Conformance posture

The register (`/conformance/`) measures which normative requirements an
implementation covers; the tiers (11) name what a claim would mean. While the spec
is draft, its own note holds: conformance claims are premature. Measure, publish
the measurement if you like, and let the claim wait for the spec.
