import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

import type { AppConfig } from "@/application/domain/objects/app-config";
import { appConfigMapSchema } from "@/application/domain/objects/app-config";
import type { AppConfigErrorCode, Error as DomainError } from "@/application/domain/objects/error";
import type { AppConfigRepository } from "@/application/domain/repositories/app-config-repository";
import { getErrorMessage } from "@/lib/error/helpers";

interface AwsSecretManagerOptions {
  region: string;
  secretPath: string;
  endpoint?: string;
}

export class AwsSecretManagerAppConfigRepository implements AppConfigRepository {
  private __client: SecretsManagerClient;
  private __secretPath: string;

  constructor(options: AwsSecretManagerOptions) {
    this.__client = new SecretsManagerClient({
      region: options.region,
      ...(options.endpoint ? { endpoint: options.endpoint } : {}),
    });
    this.__secretPath = options.secretPath;
  }

  private async __getConfigMap(): Promise<
    Result<Record<string, AppConfig>, DomainError<AppConfigErrorCode>>
  > {
    try {
      const command = new GetSecretValueCommand({ SecretId: this.__secretPath });
      const response = await this.__client.send(command);

      if (!response.SecretString) {
        return ok({});
      }

      const parsed = JSON.parse(response.SecretString);
      const result = appConfigMapSchema.safeParse(parsed);

      return ok(result.success ? result.data : {});
    } catch (error) {
      return err({
        code: "APP_CONFIG_READ_ERROR",
        message: `Failed to read config from AWS Secrets Manager: ${getErrorMessage(error)}`,
      });
    }
  }

  private async __saveConfigMap(
    configMap: Record<string, AppConfig>,
  ): Promise<Result<void, DomainError<AppConfigErrorCode>>> {
    try {
      const command = new PutSecretValueCommand({
        SecretId: this.__secretPath,
        SecretString: JSON.stringify(configMap),
      });

      await this.__client.send(command);
      return ok(undefined);
    } catch (error) {
      return err({
        code: "APP_CONFIG_WRITE_ERROR",
        message: `Failed to write config to AWS Secrets Manager: ${getErrorMessage(error)}`,
      });
    }
  }

  async get(
    saleorDomain: string,
  ): Promise<Result<AppConfig | null, DomainError<AppConfigErrorCode>>> {
    const configMapResult = await this.__getConfigMap();
    if (configMapResult.isErr()) return err(configMapResult.error);

    return ok(configMapResult.value[saleorDomain] ?? null);
  }

  async set(
    saleorDomain: string,
    config: AppConfig,
  ): Promise<Result<void, DomainError<AppConfigErrorCode>>> {
    const configMapResult = await this.__getConfigMap();
    if (configMapResult.isErr()) return err(configMapResult.error);

    configMapResult.value[saleorDomain] = config;
    return this.__saveConfigMap(configMapResult.value);
  }

  async delete(saleorDomain: string): Promise<Result<void, DomainError<AppConfigErrorCode>>> {
    const configMapResult = await this.__getConfigMap();
    if (configMapResult.isErr()) return err(configMapResult.error);

    delete configMapResult.value[saleorDomain];
    return this.__saveConfigMap(configMapResult.value);
  }
}
