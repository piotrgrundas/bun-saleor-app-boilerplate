import type { Logger } from "@/application/domain/services/logger";
import type { LogLevel } from "@/application/infrastructure/logging/consola-logger";
import { ConsolaLogger } from "@/application/infrastructure/logging/consola-logger";

export const createLogger = (): Logger => {
  const logLevel = (process.env.LOG_LEVEL ?? "info") as LogLevel;
  return new ConsolaLogger(logLevel);
};
