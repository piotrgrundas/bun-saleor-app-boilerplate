export interface AppConfigErrorDefs {
  APP_CONFIG_READ_ERROR: never;
  APP_CONFIG_WRITE_ERROR: never;
  APP_CONFIG_DELETE_ERROR: never;
}
export type AppConfigErrorCode = keyof AppConfigErrorDefs;
