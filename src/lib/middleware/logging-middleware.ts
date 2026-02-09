import { createMiddleware } from "hono/factory";

import type { Logger } from "@/application/domain/services/logger";
import { getElapsedTime } from "@/lib/utils/timing";

export function createLoggingMiddleware(logger: Logger, meta?: Record<string, unknown>) {
  return createMiddleware(async (c, next) => {
    const elapsed = getElapsedTime();
    const requestLogger = logger.withTag(c.req.header("x-request-id") ?? "no-request-id");

    c.set("logger", requestLogger);

    requestLogger.info(`→ ${c.req.method} ${c.req.path}`, {
      ...meta,
      method: c.req.method,
      path: c.req.path,
    });

    await next();

    requestLogger.info(`← ${c.req.method} ${c.req.path} ${c.res.status} (${elapsed()}ms)`, {
      ...meta,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: elapsed(),
    });
  });
}
