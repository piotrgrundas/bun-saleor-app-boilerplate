import { err, ok } from "neverthrow";

import type { SaleorClientErrorCode } from "@/application/domain/objects/error";
import type { AsyncDomainResult } from "@/application/domain/objects/result";
import type { SaleorClient } from "@/application/domain/services/saleor-client-service";
import { getErrorMessage } from "@/lib/error/helpers";
import type { GraphQLResponse } from "@/lib/graphql/types";
import { AppIdDocument, type AppIdQuery } from "./graphql/saleor/AppIdQuery.generated";

export class BaseSaleorClient implements SaleorClient {
  async getAppId(apiUrl: string, token: string): AsyncDomainResult<string, SaleorClientErrorCode> {
    let response: Response;
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: AppIdDocument.toString() }),
      });
    } catch (e) {
      return err({
        code: "SALEOR_CLIENT_REQUEST_ERROR",
        message: getErrorMessage(e),
      });
    }

    if (!response.ok) {
      return err({
        code: "SALEOR_CLIENT_REQUEST_ERROR",
        message: `Saleor API request failed: ${response.status}`,
      });
    }

    const json = (await response.json()) as GraphQLResponse<AppIdQuery>;

    if (json.errors?.length) {
      return err({
        code: "SALEOR_CLIENT_GRAPHQL_ERROR",
        message: `Saleor GraphQL error: ${json.errors[0].message}`,
      });
    }

    const appId = json.data?.app?.id;

    if (!appId) {
      return err({
        code: "SALEOR_CLIENT_APP_NOT_FOUND_ERROR",
        message: "App ID not found in Saleor response",
      });
    }

    return ok(appId);
  }
}
