import type { AppConfigRepository } from "@/application/domain/repositories/app-config-repository";
import { AwsSecretManagerAppConfigRepository } from "@/application/infrastructure/app-config/aws/aws-secret-manager-app-config-repository";

export const createAppConfig = (): AppConfigRepository =>
  new AwsSecretManagerAppConfigRepository({
    region: process.env.AWS_REGION ?? "",
    secretPath: process.env.SECRET_MANAGER_APP_CONFIG_PATH ?? "",
    endpoint: process.env.AWS_ENDPOINT_URL,
  });
