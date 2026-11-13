# Guardrails roadmap

Enforcement is deliberately light at the start so early exploration is fast. Turn these on as the app matures. Suggested trigger: **before the first public release, or when a second contributor joins, whichever is first.**

## On now

- [x] `AGENTS.md` shared by all AI tools; thin pointers for Claude, Gemini, Copilot, Cursor
- [x] Secrets scanning (gitleaks), private-key detection, large-file check, EditorConfig, whitespace/EOF fixes (pre-commit + CI)
- [x] Conventional Commits check (local `commit-msg` hook)
- [x] Actions pinned to commit SHAs, least-privilege workflow permissions
- [x] Dependabot for GitHub Actions
- [x] Community files: LICENSE (MIT), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue/PR templates, CODEOWNERS

## Turn on when the stack is chosen

- [x] Linter + formatter, type checker (strict), test runner, one command each in `AGENTS.md`
- [x] Lockfile committed; Dependabot npm ecosystem added
- [x] CodeQL enabled for JavaScript/TypeScript
- [x] Pre-commit hooks and CI run format, lint, types, tests, audit and e2e
- [ ] ASVS-mapped security checklist: first pass in `docs/security/asvs-checklist.md`; finish once data is bundled

## Turn on when the app matures

- [ ] Branch protection / ruleset on `main`: PRs only, required status checks, up-to-date branch, no force-push, linear history
- [ ] Required review (CODEOWNERS) once there is more than one maintainer
- [ ] Raise coverage threshold (currently 60% to keep early work fast)
- [ ] Signed commits (or Sigstore gitsign) required
- [ ] GitHub settings: secret scanning + push protection, Dependabot alerts/security updates, private vulnerability reporting
- [ ] SBOM generation and signed, provenance-attested releases (SLSA)
- [ ] Enable `dependency-review` and Scorecard as required checks; track the Scorecard score
