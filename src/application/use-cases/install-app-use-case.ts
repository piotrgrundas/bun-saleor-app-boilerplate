import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

import type { Error as DomainError, InstallAppErrorCode } from "@/application/domain/objects/error";
import type { AppConfigRepository } from "@/application/domain/repositories/app-config-repository";
import type { JWKSRepository } from "@/application/domain/repositories/jwks-repository";
import type { Logger } from "@/application/domain/services/logger";
import type { SaleorClientFactory } from "@/application/domain/services/saleor-client-service";
import type { UseCase } from "@/application/domain/use-case";
import { isDomainAllowed } from "@/lib/utils/allowlist";

export interface InstallAppInput {
  saleorDomain: string;
  saleorApiUrl: string;
  authToken: string;
  allowedDomains: string[];
}

export class InstallAppUseCase implements UseCase<InstallAppInput, void, InstallAppErrorCode> {
  constructor(
    private __appConfigRepository: AppConfigRepository,
    private __saleorClientFactory: SaleorClientFactory,
    private __jwksRepository: JWKSRepository,
    private __logger: Logger,
  ) {}

  async execute(input: InstallAppInput): Promise<Result<void, DomainError<InstallAppErrorCode>>> {
    const { saleorDomain, saleorApiUrl, authToken, allowedDomains } = input;

    if (!isDomainAllowed(saleorDomain, allowedDomains)) {
      return err({
        code: "INSTALL_APP_DOMAIN_NOT_ALLOWED_ERROR",
        message: `Domain not allowed: ${saleorDomain}`,
      });
    }

    this.__logger.info(`Installing app for domain: ${saleorDomain}`);

    const saleorClient = this.__saleorClientFactory.create(saleorApiUrl, authToken);

    const appIdResult = await saleorClient.getAppId();
    if (appIdResult.isErr()) {
      return err({
        code: "INSTALL_APP_FETCH_ID_ERROR",
        message: appIdResult.error.message,
      });
    }

    const appId = appIdResult.value;

    const saveResult = await this.__appConfigRepository.set(saleorDomain, {
      saleorDomain,
      authToken,
      saleorAppId: appId,
      saleorApiUrl,
    });
    if (saveResult.isErr()) {
      return err({
        code: "INSTALL_APP_SAVE_CONFIG_ERROR",
        message: saveResult.error.message,
      });
    }

    const jwksResult = await this.__jwksRepository.getKeys(saleorDomain, true);
    if (jwksResult.isErr()) {
      return err({
        code: "INSTALL_APP_JWKS_PREFETCH_ERROR",
        message: jwksResult.error.message,
      });
    }

    this.__logger.info(`App installed successfully for domain: ${saleorDomain}`, { appId });

    return ok(undefined);
  }
}
