# Development log

Append-only. One `.md` file per meaningful action, named only by
`scripts/newlog.sh "short action"`. Never edit an existing entry: a log entry is
what was true that day, and corrections go in a later entry that names the earlier
one.

Entry structure:

```
# <Past-tense sentence: what was done>

**UTC:** YYYY-MM-DD · **Actor:** <who>

## Context
## <What was checked or found>
## <What was built or changed>
## Verification        <- named commands and their exact results
## Open risks
## Next action
```

**Verification is not optional.** An entry claiming a gate passed names the command
and its result. Structure is enforced by `tools/check-record.mjs` in the gate.
