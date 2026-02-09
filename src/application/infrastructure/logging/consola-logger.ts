import { createConsola } from "consola";

import type { Logger } from "@/application/domain/services/logger";
import { redactSensitive } from "./utils";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 3,
  debug: 4,
};

export class ConsolaLogger implements Logger {
  private __consola: ReturnType<typeof createConsola>;
  private __tag?: string;

  constructor(level: LogLevel = "info", tag?: string) {
    this.__consola = createConsola({ level: LOG_LEVEL_MAP[level] });
    this.__tag = tag;
  }

  private get __instance() {
    return this.__tag ? this.__consola.withTag(this.__tag) : this.__consola;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.__instance.debug(message, meta ? redactSensitive(meta) : undefined);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.__instance.info(message, meta ? redactSensitive(meta) : undefined);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.__instance.warn(message, meta ? redactSensitive(meta) : undefined);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.__instance.error(message, meta ? redactSensitive(meta) : undefined);
  }

  withTag(newTag: string): Logger {
    const combinedTag = this.__tag ? `${this.__tag}:${newTag}` : newTag;
    const logger = new ConsolaLogger("info", combinedTag);
    logger.__consola = this.__consola;
    return logger;
  }
}
