import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { DomainError, DomainErrorCode } from "@/application/domain/objects/error";

export interface SerializedError {
  error: string;
  message: string;
  statusCode: number;
  code?: DomainErrorCode;
  details?: unknown;
}

export class HttpError extends HTTPException {
  public readonly error: string;
  public readonly details?: unknown;

  constructor(statusCode: ContentfulStatusCode, error: string, message: string, details?: unknown) {
    super(statusCode, { message });
    this.error = error;
    this.details = details;
  }

  serialize(): SerializedError {
    return {
      error: this.error,
      message: this.message,
      statusCode: this.status,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(400, "Bad Request", message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, "Unauthorized", message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(403, "Forbidden", message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(404, "Not Found", message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(500, "Internal Server Error", message);
  }
}

export class ValidationError extends BadRequestError {
  constructor(details: unknown) {
    super("Validation failed", details);
  }
}

export class DomainException extends HttpError {
  public readonly domainError: DomainError;

  constructor(statusCode: ContentfulStatusCode, domainError: DomainError) {
    super(statusCode, domainError.code, domainError.message);
    this.domainError = domainError;
  }

  override serialize(): SerializedError {
    return {
      ...super.serialize(),
      code: this.domainError.code,
      ...(this.domainError.context ? { details: this.domainError.context } : {}),
    };
  }
}

export class ForbiddenException extends DomainException {
  constructor(domainError: DomainError) {
    super(403, domainError);
  }
}

export class BadGatewayException extends DomainException {
  constructor(domainError: DomainError) {
    super(502, domainError);
  }
}

export class UnprocessableEntityException extends DomainException {
  constructor(domainError: DomainError) {
    super(422, domainError);
  }
}

export class ServiceUnavailableException extends DomainException {
  constructor(domainError: DomainError) {
    super(503, domainError);
  }
}

export class ValidationException extends DomainException {
  constructor(domainError: DomainError) {
    super(400, domainError);
  }
}
