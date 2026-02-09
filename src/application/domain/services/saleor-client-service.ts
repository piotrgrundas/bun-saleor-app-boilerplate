import type { Result } from "neverthrow";

import type { Error as DomainError, SaleorClientErrorCode } from "../objects/error";

export interface SaleorClient {
  getAppId(): Promise<Result<string, DomainError<SaleorClientErrorCode>>>;
}

export interface SaleorClientFactory {
  create(apiUrl: string, token: string): SaleorClient;
}
