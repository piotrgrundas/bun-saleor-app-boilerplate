import { createMiddleware } from "hono/factory";

export const healthCheckMiddleware = createMiddleware(async (c, next) => {
  if (c.req.path === "/healthcheck" && c.req.method === "GET") {
    return c.json({ status: "ok" });
  }
  await next();
});
