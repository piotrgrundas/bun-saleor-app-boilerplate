import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

import type {
  Error as DomainError,
  SaleorClientErrorCode,
} from "@/application/domain/objects/error";
import type {
  SaleorClient,
  SaleorClientFactory,
} from "@/application/domain/services/saleor-client-service";
import { getErrorMessage } from "@/lib/error/helpers";
import type { GraphQLResponse } from "@/lib/graphql/types";
import { AppIdDocument, type AppIdQuery } from "./graphql/saleor/AppIdQuery.generated";

class BaseSaleorClient implements SaleorClient {
  constructor(
    private __apiUrl: string,
    private __token: string,
  ) {}

  async getAppId(): Promise<Result<string, DomainError<SaleorClientErrorCode>>> {
    let response: Response;
    try {
      response = await fetch(this.__apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.__token}`,
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

export class BaseSaleorClientFactory implements SaleorClientFactory {
  create(apiUrl: string, token: string): SaleorClient {
    return new BaseSaleorClient(apiUrl, token);
  }
}
