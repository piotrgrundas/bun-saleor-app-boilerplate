// Builds client-side React bundles using Bun's native bundler.
// Each app in src/apps/{name}/ gets its own output directory under dist/assets/{name}/.
import fs from "node:fs";
import path from "node:path";

const APPS_DIR = path.resolve("src/apps");
const ASSETS_DIR = path.resolve("dist/assets");

interface AppEntry {
  name: string;
  entryPath: string;
}

function getClientEntryPoints(): AppEntry[] {
  const entries: AppEntry[] = [];
  if (!fs.existsSync(APPS_DIR)) return entries;

  for (const dir of fs.readdirSync(APPS_DIR)) {
    const entryPath = path.join(APPS_DIR, dir, "entry-client.tsx");
    if (fs.existsSync(entryPath)) {
      entries.push({ name: dir, entryPath });
    }
  }

  return entries;
}

const apps = getClientEntryPoints();

if (apps.length === 0) {
  console.log("No client entry points found.");
  process.exit(0);
}

console.log(`Building ${apps.length} client app(s)...`);

for (const app of apps) {
  const outdir = path.join(ASSETS_DIR, app.name);
  fs.mkdirSync(outdir, { recursive: true });

  const result = await Bun.build({
    entrypoints: [app.entryPath],
    outdir,
    target: "browser",
    format: "esm",
    splitting: true,
    minify: process.env.NODE_ENV === "production",
    naming: "[name].[ext]",
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    },
  });

  if (!result.success) {
    console.error(`Client build failed for app "${app.name}":`);
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  console.log(`  ${app.name} → ${outdir}`);
}

console.log("Client build complete.");
