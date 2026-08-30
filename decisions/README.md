# Decisions

Numbered engineering decision records, `NNNN-kebab-title.md`. Header line:

```
**Status:** proposed | accepted | superseded · **Decided:** YYYY-MM-DD · **Enforced by:** <gate check or "manual">
```

Sections: Context, Decision, Consequences, Alternatives considered, Enforcement,
Source.

Rules:

- **Enforcement is required, and `manual` is a legitimate but visible answer.** A
  decision enforced by nothing is one nobody notices breaking.
- Superseding never edits the old record beyond setting `superseded_by`.
- Cite an upstream decision (planning repo, d7r-cto, the author's vault) by
  identifier; never restate it, because two copies drift and the copy is always the
  one that is wrong.
- Spec-text decisions (Status, version, tiers) are the author's and are recorded in
  the spec's own history, not here.
