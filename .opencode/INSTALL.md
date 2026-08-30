# Installing GHOST Skills in OpenCode

OpenCode installs plugins through its config. Add the plugin by git reference:

```json
{
  "plugin": ["ghost-skills@git+https://github.com/d7r-LLC/ghost-spec.git"]
}
```

Pin a version with a git ref suffix, for example `#v0.1.0`.

What the plugin does on load:

1. Registers this repository's `skills/` directory with OpenCode's skill system.
2. Injects the `ghost-using-ghost-skills` bootstrap (rules and catalog) ahead of your
   first message, once per session.

## Tool mapping

When skills reference Claude Code tools:

- `TodoWrite` becomes `todowrite`
- `Task` with subagents becomes the @mention subagent system
- `Skill` tool becomes OpenCode's native `skill` tool
- File operations become your native tools

## Troubleshooting

- No bootstrap in context: confirm the plugin appears in `opencode --version`
  diagnostics and the config path is the one OpenCode actually reads
  (`OPENCODE_CONFIG_DIR` overrides the default).
- Skills not listed by the `skill` tool: the `config.skills.paths` hook only runs
  on session start; restart the session after install or update.
