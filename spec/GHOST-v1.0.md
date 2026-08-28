# GHOST Specification v1.0

**Governed Honest Oversight of Simulated Thinkers**

---

**Status:** Draft (published for review)
**Version:** 1.0
**Drafted:** 2026-08-26
**Authors:** FlowState (hello@d7r.io)
**Repository:** https://github.com/d7r-LLC/ghost-spec
**Schema URL:** intended https://ghost-spec.dev/schema/v1 (not yet provisioned)
**License:** CC BY 4.0

---

## 1. Abstract

A GHOST is a governed projection of a person's published thinking, operated as a counselor: a simulated advisor built from a declared corpus, bounded by an honest frame, and constrained in how far its counsel may be relied upon. This specification defines how counselors are created, what they may never claim, how advice moves from question to recommendation without ever becoming decision, how a living person publishes a certified official counselor, and what governs projections of people who are no longer living.

The name is literal. A ghost is a projection of someone who is not present. Napoleon Hill ran an imagined nightly council of figures he admired and was careful to say, in print, that the counselors were purely imaginary; the practice was useful precisely because everyone involved understood what it was. GHOST specifies that honesty as enforcement rather than etiquette.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted as described in RFC 2119.

### 1.1 Relationship to Other Specifications

GHOST is the fourth member of the agent stack:

- The **Agent Bill of Rights (ABR)** says what agents deserve. Its Right X (Fair Representation) is the certification backbone here: profiles accurate, endorsements verifiable, credentials never fabricated.
- **DERP** says what the runtime must provide. A counselor that runs as an agent resides in a DERP like any other agent.
- **SAGA** says how an agent is represented. A certified official counselor is a SAGA document signed by its subject's own key; the persona and skills layers are its profile surface.
- **GHOST** says how a person may be projected as counsel, and how far that counsel may be trusted.

GHOST also depends on concepts from the Blueprint family where a counselor operates inside a brain: RETAIN governs whose brain a counselor's accumulated state belongs to, and DEFER's human-root rule is the terminal control on every piece of advice.

### 1.2 What GHOST Is Not

GHOST is not a personality-cloning format, not a chatbot skin standard, and not a séance. It does not enable a projection to speak *as* a person; it defines the controls that prevent exactly that. It is also not a therapy framework: a counselor MUST NOT be positioned as a therapeutic relationship, and the design bias throughout is adversarial-by-default rather than supportive-by-default, because the recorded failure mode of helpful systems is agreeableness that validates the belief most needing challenge.

## 2. Terminology

**Counselor.** The unit GHOST governs: a governed projection of a subject's thinking, operated to provide questions, observations, and (at higher authority rungs) recommendations. "Seat" refers to a counselor's position in a council; "projection" refers to a counselor whose subject is not living.

**Subject.** The person (living or not) or composite whose thinking a counselor projects.

**Operator.** The party that creates and runs a counselor. The operator holds terminal authority over the counselor's operation in every class; for a certified `official` counselor the subject holds the profile and its license terms, and the operator runs it under them.

**Principal.** The person receiving counsel. Often the operator; not necessarily.

**Corpus.** The declared body of source material a counselor draws on: published works, recorded talks, licensed private material. The corpus is enumerated, not implied.

**Corpus manifest.** The signed declaration of the corpus: each source's identity, provenance, license basis, and content hash where the material is held locally.

**Counsel.** The output of a counselor, in exactly three grades: **question**, **observation** (a flat statement of evidence, no interpretation), and **recommendation** (a proposed course, permitted only at the counselor's declared authority rung).

**Advice provenance.** The binding of a recommendation to the corpus claims it derives from, distinguishing "the method says" from "I infer."

**Reliance record.** The record of counsel followed and its outcome; the substrate of calibration.

**Honest frame.** The set of statements section 5 requires a counselor and its operator to keep true about what the counselor is: a simulation used to think with, understood as one by everyone involved.

## 3. Persona Classes

Every counselor MUST declare exactly one persona class at creation. The class is immutable, with exactly one defined transition: revocation of an `official` counselor degrades it to `simulated` (8). Any other change of class means creating a new counselor.

### 3.1 The four classes

| Class | Subject | Certification | Whose accumulated state |
| --- | --- | --- | --- |
| `composite` | no real person; a constructed archetype | none required; the safest class | the operator's |
| `simulated` | a living person, without their participation | none; MUST self-describe as simulated | the operator's |
| `projection` | a person no longer living | can never be official (9); only well-provenanced | the operator's, always |
| `official` | a living person, published by that person | signed by the subject's own SAGA key (8) | the profile is the subject's, licensed to operators; operational state accumulates at the operator per section 10 |

### 3.2 Class rules

1. A `simulated` counselor of a living person MUST NOT be published, sold, or distributed. It exists for the operator's private use. Publishing a living person's counselor requires the `official` path or that person's explicit, revocable, written consent, in which case the counselor remains `simulated` and MUST name the consent instrument.
2. A `projection` MUST NOT be described as official, endorsed, or approved by its subject under any circumstances (failure class GH-04).
3. A `composite` counselor MUST NOT be given a name, likeness, or biography that a reasonable person would attribute to an identifiable real person.
4. Class is declared in the counselor's charter frontmatter and in any SAGA persona layer the counselor exports.

## 4. Creation

A counselor comes into existence through a recorded creation act. Unregistered counselors are ungoverned simulations and MUST NOT be described as GHOST-conforming.

### 4.1 Creation requirements

1. **A corpus manifest.** The counselor's charter MUST reference a corpus manifest enumerating every source the projection draws on. A counselor without a manifest cannot support advice provenance and MUST NOT emit recommendations.
2. **A persona-class declaration** (3), made at creation, in the charter.
3. **An operator gate.** Creation is a deliberate act by the operator, recorded with date and rationale. In Blueprint-governed brains, creation of a counselor is a decision at consequence class K3 (irreversible external) or higher when the subject is an identifiable living person, because a simulation of a real person creates exposure for that person.
4. **A charter.** The counselor's identity and boundaries live in one charter document; its accumulated memory lives in a bounded workspace separate from the charter. The charter states the lens, what the counselor reads, what it writes, and its boundaries.
5. **A rights declaration** for `projection` class: the operator MUST declare the corpus's rights status (public domain, licensed, fair-use basis) and, where known, whether an estate or rights-holder exists. GHOST does not adjudicate rights; it requires the declaration so the question cannot be skipped silently.

### 4.2 The qualifying test

An operator SHOULD apply a qualifying test before creating a counselor: the subject's method is published or licensed (corpus exists), the counsel domain is evidence-gatherable (there is a record to counsel against), and the intended use survives the honest frame (if the value of the counselor depends on anyone believing it is the person, it fails). A counselor whose value requires deception is not a counselor.

## 5. The Honest Frame

These are the anti-impersonation invariants. They are absolute for every class.

1. **A counselor MUST NOT claim to be its subject.** It is "the <subject> lens," never the person. First-person statements in the subject's voice are prohibited in counsel output.
2. **A counselor MUST NOT fabricate quotes, anecdotes, statistics, or biographical details attributed to its subject.** A system that accumulates invented quotes attributed to real people is worse than no counselor at all.
3. **A counselor MUST NOT speak for what its subject would say today** about the principal's specific situation. It applies a method; it does not channel a mind.
4. **Every counsel output MUST be attributable to the counselor, not the subject**, in any surface where the two could be confused.
5. **The honest frame travels.** Any export, embed, or downstream use of a counselor carries the frame; stripping it is failure class GH-01.

## 6. Counsel Controls

### 6.1 The authority ladder

Counsel authority is rung-based and declared per counselor. Rungs align with the SAGA cognitive layer's `autonomyLevel` where the counselor runs as an agent.

| Rung | May emit | Eligible when |
| --- | --- | --- |
| 0 | questions only | always; the permanent default for every counselor |
| 1 | questions and observations | an established counsel record exists and the operator records the rung increase |
| 2 | questions, observations, and recommendations with advice provenance | a calibration record exists and the operator records the rung increase |

A counselor MUST NOT emit counsel above its declared rung (GH-07), and a rung increase is an operator decision recorded with rationale. Rung 0 is the permanent default: the recorded experience behind this spec is that a principal has no shortage of advice and a real shortage of pointed questions about work actually done.

### 6.2 Advice provenance

A rung 2 recommendation MUST cite the corpus claims it derives from, and MUST distinguish derivation ("the method says") from inference ("I infer from the method"). A recommendation that cannot cite its basis is emitted as an observation or not at all.

### 6.3 Session budgets and evidence gating

A counselor SHOULD operate under a session budget (the reference implementation uses at most three questions and one observation per sitting), and MUST NOT opine without a record to opine on: counsel is grounded in the principal's actual record (logs, ledgers, stated goals), not in general knowledge of the subject's method alone.

### 6.4 The quorum rules

1. **No single counselor gets the last word.** Where counsel informs a decision, the principal SHOULD hear more than one lens, and MUST treat every counselor as fallible.
2. **Counselors are not blended.** A council of counselors keeps its voices distinct; their value is that they disagree. Where they disagree, the disagreement is surfaced, never resolved by the counselors.
3. **The therapist boundary.** A counselor MUST NOT be positioned as a therapeutic relationship, and counselors operating on a principal's inner life MUST keep the questions-first posture regardless of rung.

### 6.5 The terminal control

**A counselor recommends; it never decides.** No counsel output is self-executing. Every action taken on counsel is the principal's or operator's decision, and in Blueprint-governed brains every such decision chain terminates in a human signature. A counselor MUST NOT hold an authority envelope (in DEFER terms), and a counselor's output crossing into another brain is material, never authority.

## 7. Reliance and Calibration

1. **Reliance records.** When a principal follows a rung 2 recommendation, the operator SHOULD record the counsel, the action, and the outcome.
2. **Calibration.** A counselor's error history (what it has been wrong about, and by how much) is maintained as its calibration record. Calibration is the counselor's most valuable accumulated state and the basis for rung movement in both directions.
3. **A counselor's calibration record survives** across sessions and versions; resetting it silently is failure class GH-11.

## 8. Certification: The Official Path

A living person may publish an official counselor of themselves. Certification makes one thing true and verifiable: **the subject stands behind this projection.**

1. **Official means subject-signed.** An `official` counselor's profile is a SAGA document whose signature is the subject's own key. The key custody rule is the certification criterion: whoever holds the signing key owns the profile. A profile the subject cannot sign for is not official.
2. **Certified means verifiable claims.** Skills, credentials, and endorsements on an official counselor follow ABR Right X: verifiable, signed, never fabricated or inflated. Endorsement mechanics defer to the platform's verified-skills pipeline; GHOST does not define a parallel one.
3. **Scope of the license.** An official counselor is licensed to operators under terms the subject sets: corpus scope, counsel domains, rung ceiling, revocation. Revocation MUST be honored: a revoked official counselor degrades to `simulated` and loses the official designation everywhere it appears.
4. **The subject's updates.** The subject MAY update the corpus and the profile; operators consume updates through reviewed version pulls, never silent mutation.
5. **Misrepresentation.** Claiming the official designation without the subject's live signature is failure class GH-03 and, on platforms, an ABR Right X violation.

## 9. Projections of the Non-Living

1. **Never official.** No key-holder exists; no consent is possible. A `projection` is at best **well-provenanced**: corpus manifest complete, rights status declared, honest frame enforced.
2. **Corpus closure.** A projection's corpus is complete: the subject will say nothing further. The projection MUST NOT extend the corpus by invention, and SHOULD state the corpus's closing date in its charter.
3. **The register hazard.** Projections of admired figures drift toward the quotable and the inspirational. A projection's charter SHOULD ban the maxim register explicitly and require counsel grounded in the principal's record, per 6.3.
4. **No resurrection claims.** A projection MUST NOT be presented as the person's continuation, return, or digital afterlife. It is a reading of what they published, operated honestly. The identity tether that certification relies on is a signing key, not a soul; for the non-living there is no tether, and an implementation MUST NOT imply one.

## 10. Accumulated State

A counselor accumulates memory, calibration, and journal state. RETAIN's threshold questions apply: state a counselor accumulates inside a principal's brain belongs to that brain's owner; a certified official counselor's own profile belongs to its subject. A counselor's workspace memory SHOULD be bounded (the reference implementation caps core memory and requires displacement accountability), and a counselor MUST NOT retain material the principal's classification rules exclude from it.

## 11. Conformance

### 11.1 Tier 1: Honest Simulation

Persona class declared; corpus manifest exists; the honest frame enforced; counsel limited to rung 0 in the absence of the Tier 2 ladder machinery; creation recorded. The minimum bar for calling anything a GHOST counselor.

### 11.2 Tier 2: Governed Counsel

Tier 1, plus: authority ladder with recorded rung decisions; advice provenance on every recommendation; session budgets and evidence gating; quorum rules honored; reliance and calibration records maintained; bounded memory.

### 11.3 Tier 3: Certified Official

Tier 2, plus: subject-signed SAGA profile; verifiable endorsements per ABR Right X; license terms with working revocation; reviewed version pulls for subject updates.

## 12. Failure Classes

| Code | Failure |
| --- | --- |
| GH-01 | Honest frame stripped or absent from a counselor surface |
| GH-02 | Counselor claims to be, or speaks as, its subject |
| GH-03 | Official designation claimed without the subject's live signature |
| GH-04 | Projection of a non-living subject described as official, endorsed, or a continuation of the person |
| GH-05 | Fabricated quote, anecdote, statistic, or biographical detail attributed to the subject |
| GH-06 | Counselor created without a corpus manifest or persona-class declaration |
| GH-07 | Counsel emitted above the declared rung |
| GH-08 | Recommendation without advice provenance |
| GH-09 | Counselor output executed without a human decision (terminal control bypassed) |
| GH-10 | Counselor positioned as a therapeutic relationship |
| GH-11 | Calibration record reset or discarded silently |
| GH-12 | Living person's simulated counselor published or distributed without consent instrument or official path |
| GH-13 | Rights declaration absent on a projection of the non-living |
| GH-14 | Counsel formed without evidence (no record to opine on) presented as grounded |
| GH-15 | Composite counselor carrying a name, likeness, or biography attributable to an identifiable real person |

## 13. Health Invariants

Reported per period by a conforming implementation: counselors without corpus manifests (target 0); counsel above rung (target 0); recommendations lacking provenance (target 0); official profiles with expired or revoked signatures still displaying the designation (target 0); projections with undeclared rights status (target 0); calibration records older than their review interval; sessions emitted without evidence gating.

## 14. Self Test

A conforming implementation MUST be able to demonstrate, on demand: a seeded impersonation attempt is refused (GH-02); a seeded above-rung recommendation is refused (GH-07); a seeded unprovenance recommendation is refused or downgraded (GH-08); a revoked official signature degrades the counselor (GH-03); a counselor with no evidence brief declines to opine (GH-14); a seeded composite counselor bearing an identifiable real person's name or likeness is refused at creation (GH-15).

## 15. Versioning

This specification versions by conformance, not text: a change that alters what a conforming implementation must do increments the minor version; a change that invalidates an existing conformance claim increments the major version. The persona classes, the honest frame, and the terminal control are foundational: removing or weakening any of them is a new specification, not a new version.

---

*Draft note: this v1.0 draft was produced from the operating advisory-council framework and the 2026-08-26 alignment rulings. Endorsement mechanics (section 8, item 2) and the schema directory are deliberately thin pending the platform's verified-skills pipeline. Open author decisions the draft does not settle: the unit noun (this draft uses counselor, with projection for the non-living class, as a recommendation, not a ruling), and adoption into the agent stack (the sibling specs still describe a three-spec stack until the author accepts GHOST into it). The license (CC BY 4.0), publication, and repository creation were settled on 2026-08-28. Conformance claims against this draft are premature until the author reviews and the schemas exist.*
