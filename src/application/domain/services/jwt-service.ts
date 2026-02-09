import type { Result } from "neverthrow";

import type { Error as DomainError, JwtErrorCode } from "../objects/error";

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface JWTService {
  verify(token: string, jwksUrl: string): Promise<Result<JWTPayload, DomainError<JwtErrorCode>>>;
}
