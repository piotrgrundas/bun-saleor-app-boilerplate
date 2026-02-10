import { createMiddleware } from "hono/factory";

import type { JWKSService } from "@/application/domain/services/jwks-service";
import { BadRequestError, UnauthorizedError } from "@/lib/error/base";
import { saleorWebhookHeadersSchema } from "@/application/infrastructure/saleor/webhook/schema";

/**
 * Middleware that validates Saleor webhook requests:
 * 1. Validates required headers (saleor-domain, saleor-api-url, saleor-event, saleor-signature)
 * 2. Verifies the JWS signature against the Saleor instance's JWKS
 */
export function createSaleorWebhookValidationMiddleware(jwksService: JWKSService) {
  return createMiddleware(async (context, next) => {
    const headers = {
      "saleor-domain": context.req.header("saleor-domain"),
      "saleor-api-url": context.req.header("saleor-api-url"),
      "saleor-event": context.req.header("saleor-event"),
      "saleor-signature": context.req.header("saleor-signature"),
    };

    const parsed = saleorWebhookHeadersSchema.safeParse(headers);
    if (!parsed.success) {
      throw new BadRequestError("Invalid Saleor webhook headers", parsed.error.issues);
    }

    const { "saleor-domain": domain, "saleor-signature": signature } = parsed.data;

    const body = await context.req.text();

    const result = await jwksService.verify(body, signature, domain);

    if (result.isErr()) {
      throw new UnauthorizedError("Invalid webhook signature");
    }

    context.set("saleorDomain", domain);
    context.set("saleorApiUrl", parsed.data["saleor-api-url"]);
    context.set("saleorEvent", parsed.data["saleor-event"]);

    await next();
  });
}
