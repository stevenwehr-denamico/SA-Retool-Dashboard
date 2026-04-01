# Denamico SA toolkit (web)

Part of **[SA-Retool-Dashboard](https://github.com/stevenwehr-denamico/SA-Retool-Dashboard)** — see the repository root [README](../README.md) for overview, versioning, and Cursor/GitHub sync.

Standalone version of the Denamico Solutions Architect toolkit UI. Team members can run it locally or deploy the static build—no Retool or access to the original `.jsx` file required.

## Run locally

```bash
cd denamico-sa-toolkit-web
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview   # optional: test the build locally
```

Upload the `dist/` folder to any static host (Netlify, Vercel, S3 + CloudFront, internal static server, etc.). The build uses `base: './'` so relative paths work from a subpath.

If your project path contains a `*` character (for example `*Cursor Folder`), Vite may print a warning; the build still completes via `scripts/run-vite.mjs`, which avoids loading a config file from that path.

## Source of truth

The Retool-oriented single file remains at `../denamico-sa-toolkit.jsx`. After large edits there, copy it to `src/App.jsx` again (and remove the `<link>` for DM Sans from inside the component—fonts load from `index.html`).
