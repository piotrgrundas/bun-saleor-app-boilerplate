import type { SaleorClientErrorCode } from "../objects/error";
import type { AsyncDomainResult } from "../objects/result";

export interface SaleorClient {
  getAppId(apiUrl: string, token: string): AsyncDomainResult<string, SaleorClientErrorCode>;
}
