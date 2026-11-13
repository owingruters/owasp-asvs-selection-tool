# Contributing

Thanks for helping. This project is developed with AI coding tools; humans and agents follow the same rules, which live in [AGENTS.md](AGENTS.md).

## Setup

```sh
pipx install pre-commit   # or: brew install pre-commit
pre-commit install --install-hooks --hook-type pre-commit --hook-type commit-msg
```

Stack-specific setup is added here once the stack is chosen.

## Workflow

1. Open an issue first for anything non-trivial.
2. Branch from `main`: `feat/short-name`, `fix/short-name`.
3. Keep the change small and focused.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and PR titles.
5. Run `pre-commit run --all-files` and the project's tests before opening a PR.
6. Fill in the PR template, including the AI-assistance disclosure.

## AI-assisted contributions

AI-generated code is welcome. You are responsible for every line you submit: read it, run it, and understand it. Do not submit code you could not explain in review.

## Security issues

Do not open a public issue. See [SECURITY.md](SECURITY.md).

## Licensing

By contributing you agree your contribution is licensed under the [MIT License](LICENSE).
