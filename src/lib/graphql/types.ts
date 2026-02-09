import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

export type GraphqlResolver<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
) => TResult | Promise<TResult>;

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: Array<string | number>;
    extensions?: Record<string, unknown>;
  }>;
}

export type { TypedDocumentNode };
