/**
 * Runs Vite via its Node API so we never load a vite.config from a path
 * containing "*" (e.g. *Cursor Folder), which breaks esbuild.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { build, createServer, preview } from "vite";

const mode = process.argv[2] || "dev";
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const shared = {
  root: appRoot,
  plugins: [react()],
  base: "./",
};

if (mode === "build") {
  await build({
    ...shared,
    build: {
      outDir: path.join(appRoot, "dist"),
      emptyOutDir: true,
    },
  });
} else if (mode === "preview") {
  const server = await preview({
    ...shared,
    preview: { port: 4173, strictPort: false },
    build: { outDir: path.join(appRoot, "dist") },
  });
  server.printUrls();
} else {
  const server = await createServer({ ...shared, configFile: false });
  await server.listen();
  server.printUrls();
}
