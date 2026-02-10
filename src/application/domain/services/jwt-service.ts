import type { JwtErrorCode } from "../objects/error";
import type { AsyncDomainResult } from "../objects/result";

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface JWTService {
  verify(token: string, jwksUrl: string): AsyncDomainResult<JWTPayload, JwtErrorCode>;
}
