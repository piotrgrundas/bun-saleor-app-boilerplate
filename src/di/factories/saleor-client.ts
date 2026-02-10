import type { SaleorClient } from "@/application/domain/services/saleor-client-service";
import { BaseSaleorClient } from "@/application/infrastructure/saleor/base-saleor-client";

export const createSaleorClient = (): SaleorClient => new BaseSaleorClient();
