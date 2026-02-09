import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

import { GraphQLClientError } from "@/lib/graphql/error";
import type { GraphQLResponse } from "@/lib/graphql/types";

interface GraphQLClientOptions {
  url: string;
  headers?: Record<string, string>;
}

export async function graphqlFetch<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  options: GraphQLClientOptions,
): Promise<TData> {
  const response = await fetch(options.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    throw new GraphQLClientError(json.errors);
  }

  if (!json.data) {
    throw new Error("GraphQL response missing data");
  }

  return json.data;
}
