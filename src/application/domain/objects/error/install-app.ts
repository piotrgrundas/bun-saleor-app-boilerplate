export interface InstallAppErrorDefs {
  INSTALL_APP_DOMAIN_NOT_ALLOWED_ERROR: never;
  INSTALL_APP_FETCH_ID_ERROR: never;
  INSTALL_APP_SAVE_CONFIG_ERROR: never;
  INSTALL_APP_JWKS_PREFETCH_ERROR: never;
}
export type InstallAppErrorCode = keyof InstallAppErrorDefs;
