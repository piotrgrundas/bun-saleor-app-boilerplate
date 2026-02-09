import type { Result } from "neverthrow";

import type { AppConfig } from "../objects/app-config";
import type { AppConfigErrorCode, Error as DomainError } from "../objects/error";

export interface AppConfigRepository {
  get(saleorDomain: string): Promise<Result<AppConfig | null, DomainError<AppConfigErrorCode>>>;
  set(
    saleorDomain: string,
    config: AppConfig,
  ): Promise<Result<void, DomainError<AppConfigErrorCode>>>;
  delete(saleorDomain: string): Promise<Result<void, DomainError<AppConfigErrorCode>>>;
}
