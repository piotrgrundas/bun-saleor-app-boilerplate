import type { Context } from "hono";

import type { Logger } from "@/application/domain/services/logger";
import { DomainException, HttpError, InternalServerError } from "./base";
import { getErrorMessage } from "./helpers";

export function createErrorHandler(logger: Logger) {
  return (err: Error, c: Context) => {
    if (err instanceof DomainException) {
      logger.warn(`HTTP ${err.status}: ${err.message}`, {
        code: err.domainError.code,
        statusCode: err.status,
      });

      return c.json(err.serialize(), { status: err.status });
    }

    if (err instanceof HttpError) {
      logger.warn(`HTTP ${err.status}: ${err.message}`, {
        error: err.error,
        statusCode: err.status,
      });

      return c.json(err.serialize(), { status: err.status });
    }

    logger.error("Unhandled error", {
      error: getErrorMessage(err),
      stack: err.stack,
    });

    return c.json(new InternalServerError().serialize(), { status: 500 });
  };
}
