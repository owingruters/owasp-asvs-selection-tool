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

- [ ] Linter + formatter, type checker (strictest sensible setting), test runner, with one command each in `AGENTS.md`
- [ ] Lockfile committed; Dependabot ecosystem added
- [ ] CodeQL: set language(s) and enable triggers in `.github/workflows/codeql.yml`
- [ ] Pre-commit hooks for the stack's linter/formatter; CI runs lint, types, tests, build
- [ ] ASVS-mapped security checklist for this app (which requirements apply, which are verified how)

## Turn on when the app matures

- [ ] Branch protection / ruleset on `main`: PRs only, required status checks, up-to-date branch, no force-push, linear history
- [ ] Required review (CODEOWNERS) once there is more than one maintainer
- [ ] Coverage threshold in CI
- [ ] Signed commits (or Sigstore gitsign) required
- [ ] GitHub settings: secret scanning + push protection, Dependabot alerts/security updates, private vulnerability reporting
- [ ] SBOM generation and signed, provenance-attested releases (SLSA)
- [ ] Enable `dependency-review` and Scorecard as required checks; track the Scorecard score
