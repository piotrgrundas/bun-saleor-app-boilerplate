export interface SaleorClientErrorDefs {
  SALEOR_CLIENT_REQUEST_ERROR: never;
  SALEOR_CLIENT_GRAPHQL_ERROR: never;
  SALEOR_CLIENT_APP_NOT_FOUND_ERROR: never;
}
export type SaleorClientErrorCode = keyof SaleorClientErrorDefs;
