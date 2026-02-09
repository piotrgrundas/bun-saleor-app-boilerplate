import { z } from "zod";

export const saleorAppConfigSchema = z
  .object({
    SALEOR_URL: z.string().url(),
  })
  .transform((config) => {
    const url = new URL(config.SALEOR_URL);
    return {
      ...config,
      SALEOR_DOMAIN: url.hostname,
      SALEOR_GRAPHQL_URL: `${config.SALEOR_URL}/graphql/`,
    };
  });

export type SaleorAppConfig = z.infer<typeof saleorAppConfigSchema>;
