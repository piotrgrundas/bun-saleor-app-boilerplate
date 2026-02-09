import fs from "node:fs";
import path from "node:path";

export const DIST_DIR = path.resolve("dist");
export const APPS_DIR = path.resolve("src/apps");

/**
 * Packages excluded from the server bundle.
 * - "lambda-provided": available in the AWS Lambda runtime, no install needed.
 * - "install": must be installed into dist/{appName}/node_modules/ at build time.
 */
export const SERVER_EXTERNALS = [
  { name: "@aws-sdk/client-secrets-manager", reason: "lambda-provided" },
  { name: "@sentry/aws-serverless", reason: "install" },
  { name: "@cacheable/node-cache", reason: "install" },
] as const;

export type ExternalReason = (typeof SERVER_EXTERNALS)[number]["reason"];

export interface AppEntry {
  name: string;
  entryPath: string;
}

export function discoverEntryPoints(filename: string): AppEntry[] {
  if (!fs.existsSync(APPS_DIR)) return [];

  const entries: AppEntry[] = [];
  for (const dir of fs.readdirSync(APPS_DIR)) {
    const entryPath = path.join(APPS_DIR, dir, filename);
    if (fs.existsSync(entryPath)) {
      entries.push({ name: dir, entryPath });
    }
  }
  return entries;
}

export async function buildClient(app: AppEntry, options: { minify: boolean; nodeEnv: string }) {
  const outdir = path.join(DIST_DIR, app.name, "assets");
  fs.mkdirSync(outdir, { recursive: true });

  const result = await Bun.build({
    entrypoints: [app.entryPath],
    outdir,
    target: "browser",
    format: "esm",
    splitting: true,
    minify: options.minify,
    naming: "[name].[ext]",
    define: {
      "process.env.NODE_ENV": JSON.stringify(options.nodeEnv),
    },
  });

  if (!result.success) {
    console.error(`Client build failed for app "${app.name}":`);
    for (const log of result.logs) console.error(log);
    process.exit(1);
  }

  console.log(`  ${app.name} → ${outdir}`);
}
