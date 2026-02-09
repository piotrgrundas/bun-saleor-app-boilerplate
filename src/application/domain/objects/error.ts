type ErrorCodeFormat = `${string}_ERROR`;

export const JWKS_ERROR_CODES = [
  "JWKS_FETCH_ERROR",
  "JWKS_KEY_IMPORT_ERROR",
  "JWKS_NO_MATCHING_KEY_ERROR",
  "JWKS_VERIFICATION_ERROR",
] as const satisfies ErrorCodeFormat[];
export type JwksErrorCode = (typeof JWKS_ERROR_CODES)[number];

export const JWT_ERROR_CODES = [
  "JWT_VERIFICATION_ERROR",
] as const satisfies ErrorCodeFormat[];
export type JwtErrorCode = (typeof JWT_ERROR_CODES)[number];

export const SALEOR_CLIENT_ERROR_CODES = [
  "SALEOR_CLIENT_REQUEST_ERROR",
  "SALEOR_CLIENT_GRAPHQL_ERROR",
  "SALEOR_CLIENT_APP_NOT_FOUND_ERROR",
] as const satisfies ErrorCodeFormat[];
export type SaleorClientErrorCode = (typeof SALEOR_CLIENT_ERROR_CODES)[number];

export const APP_CONFIG_ERROR_CODES = [
  "APP_CONFIG_READ_ERROR",
  "APP_CONFIG_WRITE_ERROR",
  "APP_CONFIG_DELETE_ERROR",
] as const satisfies ErrorCodeFormat[];
export type AppConfigErrorCode = (typeof APP_CONFIG_ERROR_CODES)[number];

export const INSTALL_APP_ERROR_CODES = [
  "INSTALL_APP_DOMAIN_NOT_ALLOWED_ERROR",
  "INSTALL_APP_FETCH_ID_ERROR",
  "INSTALL_APP_SAVE_CONFIG_ERROR",
  "INSTALL_APP_JWKS_PREFETCH_ERROR",
] as const satisfies ErrorCodeFormat[];
export type InstallAppErrorCode = (typeof INSTALL_APP_ERROR_CODES)[number];

export const VALIDATION_ERROR_CODES = [
  "VALIDATION_ERROR",
] as const satisfies ErrorCodeFormat[];
export type ValidationErrorCode = (typeof VALIDATION_ERROR_CODES)[number];

export const ErrorCodes = [
  ...JWKS_ERROR_CODES,
  ...JWT_ERROR_CODES,
  ...SALEOR_CLIENT_ERROR_CODES,
  ...APP_CONFIG_ERROR_CODES,
  ...INSTALL_APP_ERROR_CODES,
  ...VALIDATION_ERROR_CODES,
] as const;
export type ErrorCode = (typeof ErrorCodes)[number];

export interface Error<T extends ErrorCode = ErrorCode> {
  code: T;
  message: string;
  context?: Record<string, unknown>;
}
