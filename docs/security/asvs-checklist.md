# ASVS checklist for this application

Which ASVS 5.0.0 requirements apply to this app, and how each is verified. Cite as `v5.0.0-<chapter>.<section>.<requirement>`.

Status values: `todo`, `in-progress`, `done`, `n/a` (with a reason).

**This is a static client-side app with no accounts, server or stored personal data.** Many authentication, session and server chapters will be `n/a`. The first pass is below; it is refined as features land.

| Area                                                      | Applies | How we verify                                                                          | Status      |
| --------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------- | ----------- |
| Output encoding: no HTML injection (chapter 1)            | yes     | ESLint `no-unsanitized`, no `dangerouslySetInnerHTML`, unit tests with hostile strings | todo        |
| Validate opened files (chapter 2)                         | yes     | JSON Schema validation, size limit, tests with malformed files                         | todo        |
| Strict CSP, no third-party scripts (web frontend chapter) | yes     | CSP in `index.html`, Playwright test checks no console/CSP errors                      | in-progress |
| Dependency hygiene (configuration chapter)                | yes     | lockfile, `npm audit` in CI, Dependabot, dependency review                             | in-progress |
| Secrets not in repo                                       | yes     | gitleaks in pre-commit and CI                                                          | done        |
| Authentication, sessions, access control                  | n/a     | no accounts or server                                                                  | n/a         |

> Before relying on the row-to-chapter mapping above, confirm the exact requirement IDs against `data/asvs/` once it is bundled.
