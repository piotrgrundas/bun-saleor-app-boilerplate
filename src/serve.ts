/**
 * Local development / preview server.
 * Uses Bun's native HTTP server with Hono.
 * Run with: bun --hot src/serve.ts
 */
import { Hono } from "hono";

import dashboardApp from "./apps/dashboard/entry-server";
import handlerApp from "./apps/handler/entry-server";

const app = new Hono();
app.route("/", handlerApp);
app.route("/configuration", dashboardApp);

const port = Number(process.env.PORT ?? 8000);

console.log(`Server running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
