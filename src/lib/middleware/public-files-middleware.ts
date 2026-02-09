import { serveStatic } from "@hono/node-server/serve-static";

/**
 * Serves files from the public/ directory.
 */
export const publicFilesMiddleware = serveStatic({ root: "./public" });
