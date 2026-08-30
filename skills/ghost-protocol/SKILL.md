---
name: ghost-protocol
description: Use when taking a new subject through the GHOST pipeline end to end - provides the seven phases, the evidence threshold and scoring rubric, and the operator gates from qualification through counselor creation to process expression
metadata:
  spec_sections: "2, 3, 4, 5, 6, 9, 11"
  source_version: "1.0-draft"
---

# The GHOST protocol pipeline

Turn a subject's published thinking into three governed artifacts: a verified source
corpus, a GHOST-conforming counselor, and reusable process expressions. Seven phases;
every phase declares inputs, outputs, an exit test, and who may perform it. Agents
draft; the operator decides. This skill was proven on a full pilot traversal before
publication; its rules are the ones that survived contact.

## Phase map

| Phase | Name | Output | Gate at exit |
|---|---|---|---|
| 0 | Qualify | qualification record | operator authorizes research |
| 1 | Discover | source census | none (breadth is cheap) |
| 2 | Collect | evidence store + corpus manifest draft | bounded batches only |
| 3 | Verify and score | evidence ledger + confidence score | threshold (default 80) |
| 4 | Distill | the source folder (five-note pattern) | operator reviews |
| 5 | Charter | counselor charter + creation act | **operator only** (spec 4.1.3) |
| 6 | Express | process notes from primitives | operator approves routing |

## Phase 0: qualify (spec 4.2)

1. Identify the subject; disambiguate from namesakes.
2. Determine subject status: living, deceased, or none. This fixes the persona class
   (spec 3.1) and everything downstream: living without participation is `simulated`
   (private use only, GH-12); deceased is `projection` (rights declaration required,
   GH-13; corpus closure, 9.2); no real person is `composite`.
3. Corpus existence test: the method is published or licensed, or there is no
   counselor (4.1.1).
4. Evidence-gatherable test: there is a record of the principal's to counsel against
   (6.3, GH-14).
5. Honest-frame survival test: if the value depends on anyone believing the
   projection is the person, stop (4.2).

## Phases 1 to 2: discover, then collect

Breadth first: a census of everything that exists (official properties, works,
recordings, independent secondary sources, criticism), each row carrying a
provenance class. Then bounded depth: harvest what the census marks in scope, prefer
local tooling over paid services, persist raw material in a durable evidence store
outside the knowledge base, and record source, retrieval date, and content hash for
everything held, because those rows become the corpus manifest (4.1.1; schema:
`schema/v1/corpus-manifest.schema.json`). Never harvest full copyrighted texts;
acquisition of licensed copies is an operator purchase decision the pipeline
recommends and never makes.

## Phase 3: verify and score

The skeptic pass. The binding lesson: **the practices are testable, the testimony is
not**; audit biography and method as separate objects. Score five dimensions,
weighted: identity and biography (15; **capped at 50 while no disinterested source
corroborates the outline of the life**), corpus coverage (25), method triangulation
(30; an element counts when attested in two or more independent sources), rights
clarity (15), criticism coverage (15).

**Route on the score.** At or above threshold, proceed. Below it, loop to phase 2
with the gaps named in the ledger: the score measures collection depth, never
subject fitness. Return to phase 0 only when a qualification-relevant fact changes.
The operator may waive the threshold for a subject; record the waiver, keep every
artifact marked partially verified, and never let the waiver rewrite the rule.

## Phase 4: distill

Five notes, same names every time: the subject hub (biography with verified versus
claimed columns, credibility audit, body of work, rights posture); structure and
principles of the primary work; core practices as trigger, action, artifact,
cadence, failure mode; claims, evidence, and criticism (including the uncited
statistics, flagged so they are never laundered); reusable primitives with an
explicit discard list. Function crosses; expression never does: no verbatim scripts,
no wording close enough to be recognized.

## Phase 5: charter (operator only)

Use the `ghost-counselor-creation` skill. Nothing in this phase is an agent's act:
agents draft the charter and manifest; the recorded creation act (4.1.3), the
persona-class declaration, and the self test sign-off are the operator's.

## Phase 6: express

Map the distilled primitives into the operator's own process library as proposals.
Adopt, adapt, or discard each primitive with the reason recorded; adaptation is
normal (a method's "the seller decides" becomes "recommend plainly, the principal
decides", which is the spec's own terminal control, 6.5). A counselor, once created,
reviews the drafts at its declared rung: questions only at rung 0, and disagreement
between counselors is surfaced, never resolved by them (6.4).

## Failure classes this pipeline must not produce

GH-02 (speaking as the subject), GH-05 (fabricated attribution), GH-06 (creation
without manifest or class), GH-12 (publishing a living person's simulated
counselor), GH-13 (projection without rights declaration), GH-14 (counsel without
evidence). Each is checkable at a named phase exit above.
