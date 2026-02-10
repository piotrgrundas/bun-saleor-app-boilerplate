import type { JwksErrorCode } from "../objects/error";
import type { AsyncDomainResult } from "../objects/result";

export interface JWKSService {
  verify(
    payload: string,
    signature: string,
    saleorDomain: string,
  ): AsyncDomainResult<string, JwksErrorCode>;
}
