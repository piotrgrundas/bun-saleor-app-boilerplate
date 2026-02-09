import { container } from "@/di/container";
import { createSaleorWebhookValidationMiddleware } from "@/application/infrastructure/saleor/middleware/saleor-webhook-validation-middleware";

const { jwksService } = container.items;

import { Hono } from "hono";

const webhooks = new Hono();

const webhookValidation = createSaleorWebhookValidationMiddleware(jwksService);

/**
 * POST /api/saleor/webhooks/product-updated
 * Handles the PRODUCT_UPDATED webhook event.
 */
webhooks.post("/product-updated", webhookValidation, async (c) => {
  const body = await c.req.json();
  const saleorDomain = c.get("saleorDomain");
  const saleorEvent = c.get("saleorEvent");
  const logger = c.get("logger");

  logger.info("Product updated webhook received", {
    saleorDomain,
    saleorEvent,
    productId: body?.product?.id,
  });

  // TODO: Add your product update handling logic here

  return c.json({ success: true });
});

export { webhooks as saleorWebhooks };
