import type { Result } from "neverthrow";

import type { Error as DomainError, JwksErrorCode } from "../objects/error";

export interface JWKSService {
  verify(
    payload: string,
    signature: string,
    saleorDomain: string,
  ): Promise<Result<string, DomainError<JwksErrorCode>>>;
}
