# SA Retool Dashboard

Denamico **Solutions Architect toolkit**: a React-based UI for data mapping, imports, schema exploration, integration design, and related SA workflows. This repository holds both the **Retool-oriented single file** and a **standalone web app** so the team can use or deploy the toolkit without Retool.

**Repository:** [github.com/stevenwehr-denamico/SA-Retool-Dashboard](https://github.com/stevenwehr-denamico/SA-Retool-Dashboard)

## Contents

| Path | Purpose |
|------|--------|
| `denamico-sa-toolkit.jsx` | Single-file React component for Retool (or any React host). Primary artifact for Retool dashboards. |
| `denamico-sa-toolkit-web/` | Vite + React standalone app: same UI, runnable via `npm run dev` or deployable static `dist/`. |

## Quick start (standalone web)

```bash
cd denamico-sa-toolkit-web
npm install
npm run dev
```

Build for hosting:

```bash
npm run build
```

See [`denamico-sa-toolkit-web/README.md`](denamico-sa-toolkit-web/README.md) for details (including paths with special characters in folder names).

## Keeping Retool and the web app in sync

1. **Default workflow:** edit `denamico-sa-toolkit.jsx` when working in Retool or for the canonical component.
2. **After meaningful changes:** copy the file to `denamico-sa-toolkit-web/src/App.jsx`.
3. **Remove** any `<link href="https://fonts.googleapis.com/...DM+Sans..."` from inside the component if present (fonts load from `denamico-sa-toolkit-web/index.html`).
4. Run `npm run build` in `denamico-sa-toolkit-web` before a release if you publish `dist/`.
5. Commit both files in one commit when they represent the same version; note it in [`CHANGELOG.md`](CHANGELOG.md).

Longer checklist: [`docs/CURSOR-GITHUB-SYNC.md`](docs/CURSOR-GITHUB-SYNC.md).

## Versioning and history

- **Changelog:** [`CHANGELOG.md`](CHANGELOG.md) — record user-facing and structural changes by version.
- **Git tags:** tag releases (e.g. `v1.0.0`) after updating the changelog so GitHub shows clear release points.
- **Commits:** prefer messages that state *what* changed and *why* (and reference tickets if your team uses them).

## Contributing (within Denamico)

1. Branch from `main` for changes (`feature/…`, `fix/…`).
2. Open a pull request on GitHub for review when required by team practice.
3. Update `CHANGELOG.md` under `[Unreleased]` or the target version before merge.

## License

See [`LICENSE`](LICENSE).
