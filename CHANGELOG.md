# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- _(nothing yet — add items here before the next release)_

## [1.0.0] — 2026-04-01

### Added

- **Retool component:** `denamico-sa-toolkit.jsx` — full SA toolkit UI (dashboard, data mapping studio, file import, bulk records, record explorer, property architect, schema explorer, batch properties, integration designer, workflow templates, webhook tester).
- **Standalone web app:** `denamico-sa-toolkit-web/` — Vite + React packaging of the same UI for local use and static hosting without Retool.
- **Build tooling:** programmatic Vite runner (`scripts/run-vite.mjs`) for environments where the project path contains characters that break default Vite config loading (e.g. `*` in parent folder names).
- **Documentation:** repository README, nested web README, this changelog, and Cursor/GitHub alignment guide under `docs/`.

[Unreleased]: https://github.com/stevenwehr-denamico/SA-Retool-Dashboard/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/stevenwehr-denamico/SA-Retool-Dashboard/releases/tag/v1.0.0
