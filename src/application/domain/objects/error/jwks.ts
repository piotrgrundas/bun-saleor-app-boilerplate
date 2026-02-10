export interface JwksErrorDefs {
  JWKS_FETCH_ERROR: never;
  JWKS_KEY_IMPORT_ERROR: never;
  JWKS_NO_MATCHING_KEY_ERROR: never;
  JWKS_VERIFICATION_ERROR: never;
}
export type JwksErrorCode = keyof JwksErrorDefs;
