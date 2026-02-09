import { afterEach, describe, expect, it, spyOn } from "bun:test";

import { BaseSaleorClientFactory } from "./base-saleor-client";

const API_URL = "https://test.saleor.cloud/graphql/";
const TOKEN = "test-token";

let fetchSpy: ReturnType<typeof spyOn>;

const mockFetch = (response: Response) => {
  fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(response);
};

const mockFetchError = (error: Error) => {
  fetchSpy = spyOn(globalThis, "fetch").mockRejectedValue(error);
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

afterEach(() => {
  fetchSpy?.mockRestore();
});

describe("BaseSaleorClientFactory", () => {
  it("creates a client", () => {
    // given
    const factory = new BaseSaleorClientFactory();

    // when
    const client = factory.create(API_URL, TOKEN);

    // then
    expect(client).toBeDefined();
    expect(client.getAppId).toBeFunction();
  });
});

describe("BaseSaleorClient.getAppId", () => {
  it("returns app id on success", async () => {
    // given
    mockFetch(jsonResponse({ data: { app: { id: "app-123" } } }));
    const client = new BaseSaleorClientFactory().create(API_URL, TOKEN);

    // when
    const result = await client.getAppId();

    // then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe("app-123");
  });

  it("sends correct request", async () => {
    // given
    mockFetch(jsonResponse({ data: { app: { id: "app-123" } } }));

    // when
    await new BaseSaleorClientFactory().create(API_URL, TOKEN).getAppId();

    // then
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe(API_URL);
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe(`Bearer ${TOKEN}`);
  });

  it("returns SALEOR_CLIENT_REQUEST_ERROR on network error", async () => {
    // given
    mockFetchError(new Error("connection refused"));
    const client = new BaseSaleorClientFactory().create(API_URL, TOKEN);

    // when
    const result = await client.getAppId();

    // then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().code).toBe("SALEOR_CLIENT_REQUEST_ERROR");
    expect(result._unsafeUnwrapErr().message).toBe("connection refused");
  });

  it("returns SALEOR_CLIENT_REQUEST_ERROR on non-ok response", async () => {
    // given
    mockFetch(jsonResponse({}, 500));
    const client = new BaseSaleorClientFactory().create(API_URL, TOKEN);

    // when
    const result = await client.getAppId();

    // then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().code).toBe("SALEOR_CLIENT_REQUEST_ERROR");
    expect(result._unsafeUnwrapErr().message).toContain("500");
  });

  it("returns SALEOR_CLIENT_GRAPHQL_ERROR on graphql errors", async () => {
    // given
    mockFetch(jsonResponse({ errors: [{ message: "Permission denied" }] }));
    const client = new BaseSaleorClientFactory().create(API_URL, TOKEN);

    // when
    const result = await client.getAppId();

    // then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().code).toBe("SALEOR_CLIENT_GRAPHQL_ERROR");
    expect(result._unsafeUnwrapErr().message).toContain("Permission denied");
  });

  it("returns SALEOR_CLIENT_APP_NOT_FOUND_ERROR when app is null", async () => {
    // given
    mockFetch(jsonResponse({ data: { app: null } }));
    const client = new BaseSaleorClientFactory().create(API_URL, TOKEN);

    // when
    const result = await client.getAppId();

    // then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().code).toBe("SALEOR_CLIENT_APP_NOT_FOUND_ERROR");
  });

  it("returns SALEOR_CLIENT_APP_NOT_FOUND_ERROR when data is missing", async () => {
    // given
    mockFetch(jsonResponse({}));
    const client = new BaseSaleorClientFactory().create(API_URL, TOKEN);

    // when
    const result = await client.getAppId();

    // then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().code).toBe("SALEOR_CLIENT_APP_NOT_FOUND_ERROR");
  });
});
