import { describe, expect, it } from "vitest";
import { err, ok } from "neverthrow";

import type { JWKSService } from "@/application/domain/services/jwks-service";
import { BadRequestError, UnauthorizedError } from "@/lib/error/base";
import { createTestApp } from "@/lib/test/app";
import { createTestRequest } from "@/lib/test/request";

import { createSaleorWebhookValidationMiddleware } from "./saleor-webhook-validation-middleware";

const validHeaders = {
  "saleor-domain": "my-store.saleor.cloud",
  "saleor-api-url": "https://my-store.saleor.cloud/graphql/",
  "saleor-event": "ORDER_CREATED",
  "saleor-signature": "valid-signature",
};

function createMockJwksService(verifyResult: "ok" | "err" = "ok"): JWKSService {
  return {
    async verify() {
      return verifyResult === "ok"
        ? ok("verified-payload")
        : err({ code: "JWKS_VERIFICATION_FAILED" as const, message: "Invalid signature" });
    },
  };
}

function createApp(jwksService: JWKSService) {
  const app = createTestApp();
  app.use("*", createSaleorWebhookValidationMiddleware(jwksService));
  app.post("/webhook", (c) =>
    c.json({
      domain: c.get("saleorDomain"),
      apiUrl: c.get("saleorApiUrl"),
      event: c.get("saleorEvent"),
    }),
  );
  app.onError((error, c) => {
    if (error instanceof BadRequestError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof UnauthorizedError) {
      return c.json({ error: error.message }, 401);
    }
    return c.json({ error: "Internal Server Error" }, 500);
  });
  return app;
}

describe("createSaleorWebhookValidationMiddleware", () => {
  it("sets context values for valid webhook request", async () => {
    // given
    const app = createApp(createMockJwksService("ok"));

    // when
    const res = await app.request(
      createTestRequest("/webhook", {
        method: "POST",
        headers: validHeaders,
        body: JSON.stringify({ event: "order_created" }),
      }),
    );

    // then
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.domain).toBe("my-store.saleor.cloud");
    expect(body.apiUrl).toBe("https://my-store.saleor.cloud/graphql/");
    expect(body.event).toBe("ORDER_CREATED");
  });

  it.each([
    { desc: "missing saleor-domain", omit: "saleor-domain" as const },
    { desc: "missing saleor-event", omit: "saleor-event" as const },
    { desc: "missing saleor-signature", omit: "saleor-signature" as const },
  ])("returns 400 when $desc", async ({ omit }) => {
    // given
    const app = createApp(createMockJwksService("ok"));
    const { [omit]: _, ...headers } = validHeaders;

    // when
    const res = await app.request(
      createTestRequest("/webhook", {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      }),
    );

    // then
    expect(res.status).toBe(400);
  });

  it("returns 400 when saleor-api-url is invalid", async () => {
    // given
    const app = createApp(createMockJwksService("ok"));

    // when
    const res = await app.request(
      createTestRequest("/webhook", {
        method: "POST",
        headers: { ...validHeaders, "saleor-api-url": "not-a-url" },
        body: JSON.stringify({}),
      }),
    );

    // then
    expect(res.status).toBe(400);
  });

  it("returns 401 when signature verification fails", async () => {
    // given
    const app = createApp(createMockJwksService("err"));

    // when
    const res = await app.request(
      createTestRequest("/webhook", {
        method: "POST",
        headers: validHeaders,
        body: JSON.stringify({ event: "order_created" }),
      }),
    );

    // then
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Invalid webhook signature");
  });
});
