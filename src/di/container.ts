import { createContainer } from "iti";

import { InstallAppUseCase } from "@/application/use-cases/install-app-use-case";
import { createAppConfig } from "./factories/app-config";
import { createJwksRepository, createJwksService } from "./factories/jwks";
import { createJwtService } from "./factories/jwt";
import { createLogger } from "./factories/logging";
import { createSaleorClient } from "./factories/saleor-client";

export const container = createContainer()
  .add({
    logger: () => createLogger(),
  })
  .add({
    jwksRepository: () => createJwksRepository(),
  })
  .add((ctx) => ({
    jwksService: () => createJwksService(ctx.jwksRepository),
  }))
  .add({
    jwtService: () => createJwtService(),
  })
  .add({
    appConfigRepository: () => createAppConfig(),
  })
  .add({
    saleorClient: () => createSaleorClient(),
  })
  .add((ctx) => ({
    installApp: () =>
      new InstallAppUseCase(
        ctx.appConfigRepository,
        ctx.saleorClient,
        ctx.jwksRepository,
        ctx.logger,
      ),
  }));

export type AppContainer = typeof container;
