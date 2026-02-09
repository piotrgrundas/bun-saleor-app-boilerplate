import type { Logger } from "@/application/domain/services/logger";

declare module "hono" {
  interface ContextVariableMap {
    origin: string;
    logger: Logger;
    saleorDomain: string;
    saleorApiUrl: string;
    saleorEvent: string;
  }
}
