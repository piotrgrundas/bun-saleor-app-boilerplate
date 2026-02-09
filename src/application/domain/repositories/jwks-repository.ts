import type { Result } from "neverthrow";

import type { Error as DomainError, JwksErrorCode } from "../objects/error";

export interface JWKSRepository {
  getKeys(
    saleorDomain: string,
    forceRefresh?: boolean,
  ): Promise<Result<JsonWebKey[], DomainError<JwksErrorCode>>>;
}
