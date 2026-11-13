@AGENTS.md

## Claude Code specifics

- Shared permissions live in `.claude/settings.json` (deny rules for secrets and destructive commands). Personal overrides go in `.claude/settings.local.json`, which is git-ignored.
- Do not duplicate rules here. Add them to `AGENTS.md` so every tool sees them.
