# Aligning Cursor, local files, and GitHub

This doc is the **reference workflow** for keeping your Cursor workspace, this folder on disk, and the `SA-Retool-Dashboard` GitHub repository consistent over time.

## Roles of each place

| Location | Role |
|----------|------|
| **GitHub** (`stevenwehr-denamico/SA-Retool-Dashboard`) | Source of truth for the team; history, reviews, releases. |
| **Local folder** (e.g. under Cursor `*Cursor Folder` / SA enhancements) | Where you edit; must be `git pull` / `git push` in sync with GitHub. |
| **Cursor** | Editor and AI context; opens the same local folder; does not replace GitHub. |

## Day-to-day flow

1. **Start work:** `git checkout main && git pull origin main`.
2. **Create a branch** (optional but recommended): `git checkout -b feature/short-description`.
3. **Edit** in Cursor as usual (`denamico-sa-toolkit.jsx` and/or `denamico-sa-toolkit-web/`).
4. **If you changed the Retool file:** copy to the web app when you want parity:
   - `denamico-sa-toolkit.jsx` → `denamico-sa-toolkit-web/src/App.jsx`
   - Remove in-component Google Font `<link>` if you pasted it back in (fonts belong in `index.html`).
5. **Verify:** from `denamico-sa-toolkit-web/`, run `npm install` (if needed), `npm run dev` or `npm run build`.
6. **Commit:** clear message, e.g. `feat: add webhook tester validation` or `fix: mapping studio search`.
7. **Push:** `git push -u origin <branch>` and open a PR, or push to `main` if that matches team policy.
8. **Release (when appropriate):** bump notes in `CHANGELOG.md`, tag `vX.Y.Z`, push tag.

## What to commit

- **Do commit:** source (`.jsx`, `src/`, `scripts/`, `package.json`, `package-lock.json`, `index.html`, docs, `.gitignore`).
- **Do not commit:** `node_modules/`, `dist/` (rebuild in CI or locally before deploy).

## Logging for future reference

- Use **CHANGELOG.md** for human-readable release notes.
- Use **Git commit messages** for line-level history (searchable in GitHub).
- Use **GitHub Releases** (optional) for milestone summaries linked to tags.

## GitHub repository settings (checklist)

Complete these in the GitHub UI for the repo (one-time):

- **Description:** e.g. `Denamico SA toolkit — Retool component + standalone React web app`
- **Website** (if deployed): production or docs URL
- **Topics:** e.g. `denamico`, `hubspot`, `retool`, `react`, `solutions-architect`
- **Branch protection** on `main` (if the org requires PR reviews)
- **Rules / collaborators** per Denamico policy

## Troubleshooting

- **Merge conflicts:** resolve locally, run the web app, then commit.
- **Vite warning about `*` in path:** expected in some Cursor folder layouts; build still works via `scripts/run-vite.mjs` (see nested README).
