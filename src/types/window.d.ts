// Client-side environment types
// These are injected into window by the HTML shell (see src/lib/client/mount.ts)
declare interface Window {
  env: {
    BASE_PATH: string;
    APP_NAME: string;
    APP_VERSION: string;
  };
  SALEOR_UI_APP_TOKEN?: string;
}
