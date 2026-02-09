// Production build script.
// 1. Cleans dist/
// 2. Builds each server entry into dist/{appName}/
// 3. Builds each client entry into dist/assets/{appName}/
// 4. Copies public assets
// 5. Generates package.json for ESM Lambda compatibility
import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const APPS_DIR = path.resolve("src/apps");

// Clean
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// --- Server build ---
interface AppEntry {
  name: string;
  entryPath: string;
}

function getServerEntryPoints(): AppEntry[] {
  const entries: AppEntry[] = [];
  if (!fs.existsSync(APPS_DIR)) return entries;

  for (const dir of fs.readdirSync(APPS_DIR)) {
    const entryPath = path.join(APPS_DIR, dir, "entry-server.ts");
    if (fs.existsSync(entryPath)) {
      entries.push({ name: dir, entryPath });
    }
  }
  return entries;
}

const serverApps = getServerEntryPoints();
if (serverApps.length === 0) {
  console.error("No server entry points found.");
  process.exit(1);
}

console.log(`Building ${serverApps.length} server app(s)...`);

for (const app of serverApps) {
  const outdir = path.join(DIST_DIR, app.name);
  fs.mkdirSync(outdir, { recursive: true });

  const result = await Bun.build({
    entrypoints: [app.entryPath],
    outdir,
    target: "bun",
    format: "esm",
    minify: true,
    naming: "[name].[ext]",
    external: [
      "@aws-sdk/client-secrets-manager",
      "@sentry/aws-serverless",
      "@cacheable/node-cache",
    ],
  });

  if (!result.success) {
    console.error(`Server build failed for app "${app.name}":`);
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  console.log(`  ${app.name} → ${outdir}`);
}

// --- Client build ---
console.log("Building client apps...");
const clientProc = Bun.spawnSync(["bun", "run", "scripts/build-client.ts"], {
  env: { ...process.env, NODE_ENV: "production" },
  stdio: ["inherit", "inherit", "inherit"],
});

if (clientProc.exitCode !== 0) {
  console.error("Client build failed.");
  process.exit(1);
}

// --- Copy public assets ---
const publicDir = path.resolve("public");
if (fs.existsSync(publicDir)) {
  for (const file of fs.readdirSync(publicDir)) {
    fs.copyFileSync(path.join(publicDir, file), path.join(DIST_DIR, file));
  }
  console.log("Public assets copied.");
}

// --- Generate package.json for Lambda ESM ---
fs.writeFileSync(path.join(DIST_DIR, "package.json"), JSON.stringify({ type: "module" }, null, 2));

console.log("Build complete → dist/");
