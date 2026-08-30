# Contributing

The specification is a draft published for review (CC BY 4.0). External
contributions are not yet being accepted; the `rfcs/` process will open when the
spec leaves draft. Comments are welcome at the contact below.

Editing rules, matching the sibling spec repositories:

1. `spec/` is normative; everything else is not.
2. Never introduce an em dash character or a machine-absolute path into spec text.
3. Every normative requirement states a failure mode; fail closed is the default.
4. Do not change Status, versions, or tier definitions; those are author decisions.
5. RFC 2119 keywords are used exactly (MUST, MUST NOT, SHOULD, SHOULD NOT, MAY).

Engineering rules for everything that is not spec text: `CLAUDE.md` (the contract)
and `docs/ENGINEERING-STANDARD.md`. The gate is `scripts/ci.sh`; rules 2 and 5 are
checked by it rather than trusted.

Contact: hello@d7r.io
