import NodeCache from "@cacheable/node-cache";
import { err, ok } from "neverthrow";

import type { JwksErrorCode } from "@/application/domain/objects/error";
import type { AsyncDomainResult } from "@/application/domain/objects/result";
import type { JWKSRepository } from "@/application/domain/repositories/jwks-repository";
import { getErrorMessage } from "@/lib/error/helpers";

const CACHE_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

interface JWKSResponse {
  keys: JsonWebKey[];
}

export class JoseJWKSRepository implements JWKSRepository {
  private __cache: NodeCache<JsonWebKey[]>;

  constructor() {
    this.__cache = new NodeCache<JsonWebKey[]>({ stdTTL: CACHE_TTL_SECONDS });
  }

  private async __fetchJWKS(saleorDomain: string): AsyncDomainResult<JsonWebKey[], JwksErrorCode> {
    const jwksUrl = `https://${saleorDomain}/.well-known/jwks.json`;

    try {
      const response = await fetch(jwksUrl);
      if (!response.ok) {
        return err({
          code: "JWKS_FETCH_ERROR",
          message: `Failed to fetch JWKS from ${jwksUrl}: ${response.status}`,
        });
      }

      const data = (await response.json()) as JWKSResponse;
      return ok(data.keys);
    } catch (error) {
      return err({
        code: "JWKS_FETCH_ERROR",
        message: `Failed to fetch JWKS from ${jwksUrl}: ${getErrorMessage(error)}`,
      });
    }
  }

  async getKeys(
    saleorDomain: string,
    forceRefresh = false,
  ): AsyncDomainResult<JsonWebKey[], JwksErrorCode> {
    const cacheKey = `jwks:${saleorDomain}`;

    if (!forceRefresh) {
      const cached = this.__cache.get(cacheKey);
      if (cached) return ok(cached);
    }

    const result = await this.__fetchJWKS(saleorDomain);
    if (result.isOk()) {
      this.__cache.set(cacheKey, result.value);
    }

    return result;
  }
}
