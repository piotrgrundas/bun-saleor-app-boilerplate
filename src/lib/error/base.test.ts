import { describe, expect, it } from "vitest";

import type { Error as DomainError } from "@/application/domain/objects/error";
import { DomainException, ValidationException } from "./base";

describe("DomainException", () => {
  it("serializes context as details when present", () => {
    // given
    const domainError: DomainError<"VALIDATION_ERROR"> = {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      context: { fieldErrors: { email: ["invalid format"] } },
    };

    // when
    const serialized = new DomainException(400, domainError).serialize();

    // then
    expect(serialized).toEqual({
      error: "VALIDATION_ERROR",
      message: "Validation failed",
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: { fieldErrors: { email: ["invalid format"] } },
    });
  });

  it("omits details when context is undefined", () => {
    // given
    const domainError: DomainError<"VALIDATION_ERROR"> = {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
    };

    // when
    const serialized = new DomainException(400, domainError).serialize();

    // then
    expect(serialized.details).toBeUndefined();
  });
});

describe("ValidationException", () => {
  it("maps to HTTP 400", () => {
    // given
    const domainError: DomainError<"VALIDATION_ERROR"> = {
      code: "VALIDATION_ERROR",
      message: "Invalid input",
      context: { formErrors: ["missing required fields"] },
    };

    // when
    const exception = new ValidationException(domainError);

    // then
    expect(exception.status).toBe(400);
    expect(exception.serialize()).toEqual({
      error: "VALIDATION_ERROR",
      message: "Invalid input",
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: { formErrors: ["missing required fields"] },
    });
  });
});
