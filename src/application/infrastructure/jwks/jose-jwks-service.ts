import { flattenedVerify, importJWK } from "jose";
import { err, ok } from "neverthrow";

import type { JwksErrorCode } from "@/application/domain/objects/error";
import type { AsyncDomainResult } from "@/application/domain/objects/result";
import type { JWKSRepository } from "@/application/domain/repositories/jwks-repository";
import type { JWKSService } from "@/application/domain/services/jwks-service";

export class JoseJWKSService implements JWKSService {
  constructor(private __jwksRepository: JWKSRepository) {}

  private async __tryVerify(
    payload: string,
    signature: string,
    saleorDomain: string,
    forceRefresh: boolean,
  ): AsyncDomainResult<string, JwksErrorCode> {
    const keysResult = await this.__jwksRepository.getKeys(saleorDomain, forceRefresh);
    if (keysResult.isErr()) return err(keysResult.error);

    for (const jwk of keysResult.value) {
      let key: Awaited<ReturnType<typeof importJWK>>;
      try {
        key = await importJWK(jwk);
      } catch {
        continue;
      }

      try {
        const jws = {
          payload,
          protected: signature.split(".")[0],
          signature: signature.split(".").slice(-1)[0],
        };

        const result = await flattenedVerify(jws, key);
        return ok(new TextDecoder().decode(result.payload));
      } catch {}
    }

    return err({
      code: "JWKS_NO_MATCHING_KEY_ERROR",
      message: "No matching key found in JWKS",
    });
  }

  async verify(
    payload: string,
    signature: string,
    saleorDomain: string,
  ): AsyncDomainResult<string, JwksErrorCode> {
    const result = await this.__tryVerify(payload, signature, saleorDomain, false);

    if (result.isOk()) {
      return result;
    }

    // Retry with fresh keys (handles key rotation)
    return this.__tryVerify(payload, signature, saleorDomain, true);
  }
}
