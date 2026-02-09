import { serveStatic } from "@hono/node-server/serve-static";
import { createMiddleware } from "hono/factory";

/**
 * Serves static assets from the dist directory (production only).
 * Rewrites paths to strip BASE_PATH prefix.
 */
export function createAssetsMiddleware(basePath: string) {
  return createMiddleware(async (c, next) => {
    if (!c.req.path.startsWith(`${basePath}/assets/`)) {
      return next();
    }

    const rewrittenPath = c.req.path.replace(basePath, "");

    return serveStatic({
      root: "./dist",
      rewriteRequestPath: () => rewrittenPath,
    })(c, next);
  });
}
