import { createRemoteJWKSet, jwtVerify } from "jose";
import { err, ok } from "neverthrow";

import type { JwtErrorCode } from "@/application/domain/objects/error";
import type { AsyncDomainResult } from "@/application/domain/objects/result";
import type { JWTPayload, JWTService } from "@/application/domain/services/jwt-service";
import { getErrorMessage } from "@/lib/error/helpers";

export class JoseJWTService implements JWTService {
  async verify(token: string, jwksUrl: string): AsyncDomainResult<JWTPayload, JwtErrorCode> {
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
