# 1. Static, client-side app on TypeScript, Vite and React

Status: accepted

## Context

The tool lets people filter ASVS requirements, build a selection and export it. It handles no secrets and no personal data. It is a security tool, so a small attack surface matters.

## Decision

Build a static single-page app that runs entirely in the browser, hosted on GitHub Pages. No backend, accounts or database. Stack: TypeScript (strict), Vite, React, Vitest, Playwright. Saved selections are files the user owns.

## Alternatives considered

SvelteKit (less code, smaller ecosystem and weaker AI-tool support), Astro (suits mostly static pages), vanilla TypeScript (state handling would be hand-rolled), Python server apps (need a server).

## Consequences

Tiny attack surface and free hosting. Sharing between teams happens by sharing files. PDF is generated in the browser. A backend can be added later if sharing becomes a real need.
