import { createMiddleware } from "hono/factory";

/**
 * Reconstructs the request origin from forwarded headers.
 * Critical for apps running behind ALB/API Gateway/reverse proxies.
 */
export const requestOriginMiddleware = createMiddleware(async (c, next) => {
  const proto = c.req.header("x-forwarded-proto") ?? "https";
  const host = c.req.header("host") ?? "localhost";
  const origin = `${proto}://${host}`;

  c.set("origin", origin);

  await next();
});
