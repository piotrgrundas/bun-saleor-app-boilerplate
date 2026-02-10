import type { JwksErrorCode } from "../objects/error";
import type { AsyncDomainResult } from "../objects/result";

export interface JWKSRepository {
  getKeys(
    saleorDomain: string,
    forceRefresh?: boolean,
  ): AsyncDomainResult<JsonWebKey[], JwksErrorCode>;
}
