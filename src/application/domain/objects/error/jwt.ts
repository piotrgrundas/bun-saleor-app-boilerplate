export interface JwtErrorDefs {
  JWT_VERIFICATION_ERROR: never;
}
export type JwtErrorCode = keyof JwtErrorDefs;
