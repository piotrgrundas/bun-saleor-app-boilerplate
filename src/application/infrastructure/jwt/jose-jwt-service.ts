import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

import type { Error as DomainError, JwtErrorCode } from "@/application/domain/objects/error";
import type { JWTPayload, JWTService } from "@/application/domain/services/jwt-service";
import { getErrorMessage } from "@/lib/error/helpers";

export class JoseJWTService implements JWTService {
  async verify(
    token: string,
    jwksUrl: string,
  ): Promise<Result<JWTPayload, DomainError<JwtErrorCode>>> {
    try {
      const jwks = createRemoteJWKSet(new URL(jwksUrl));
      const { payload } = await jwtVerify(token, jwks);
      return ok(payload as JWTPayload);
    } catch (error) {
      return err({
        code: "JWT_VERIFICATION_ERROR",
        message: `JWT verification failed: ${getErrorMessage(error)}`,
      });
    }
  }
}
