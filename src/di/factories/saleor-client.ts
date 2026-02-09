import type { SaleorClientFactory } from "@/application/domain/services/saleor-client-service";
import { BaseSaleorClientFactory } from "@/application/infrastructure/saleor/base-saleor-client";

export const createSaleorClient = (): SaleorClientFactory => new BaseSaleorClientFactory();
