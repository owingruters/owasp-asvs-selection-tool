# Product spec

**Unofficial** tool, not affiliated with or endorsed by OWASP.

## Problem

The OWASP ASVS is published mainly as a PDF and other static documents. Teams want their own version of it: the subset of requirements that applies to their company, team or project.

## What it does (v1)

1. **Browse and filter** the ASVS 5.0.0 requirements by chapter/section, level (L1/L2/L3), free-text search and category.
2. **Basket:** tick requirements into a basket, with "select all shown" for the current filter result.
3. **Save / Open:** save the basket as a file the user owns, and open it later to continue (for example to make "v2" of a team's selection). The tool stores nothing on a server.
4. **Export** the basket to PDF (same structure as the official document, filtered), CSV, Markdown and JSON (same structure as the official ASVS JSON, filtered).

Categories are our own tag layer, stored in separate mapping files. First taxonomy: OWASP Top 10, derived from the official CWE mapping and labelled unofficial.

## Out of scope for v1

Accounts, backend, pass/fail or evidence tracking, ticket integrations (Jira, GitHub), other ASVS versions, other languages (English only; the data model keeps a language field).

## Constraints

- Static site on GitHub Pages; everything runs in the browser.
- Official ASVS data is bundled unchanged under `data/asvs/`, pinned to the `v5.0.0` tag with a checksum. License: CC BY-SA 4.0 (our code: MIT).
- Every export with ASVS text carries attribution and the license notice, plus "Unofficial, not affiliated with OWASP".
- The Save file records the ASVS version it was made from and has a `schemaVersion`. A JSON Schema is published.
- The PDF is generated in the browser from HTML and print CSS. Similar structure to the official PDF, own styling, no OWASP logo. An exact-output CLI using OWASP's own pipeline is a possible later add-on.

## Quality bar

Data is verified against its checksum and known counts. Every exporter has round-trip tests. The app follows the ASVS requirements that apply to it (see `docs/security/asvs-checklist.md`).
