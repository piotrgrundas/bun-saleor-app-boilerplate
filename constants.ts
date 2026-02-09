import path from "node:path";

const nodeEnv = process.env.NODE_ENV ?? "development";

export const IS_PROD = nodeEnv === "production";
export const IS_DEV = nodeEnv === "development";
export const IS_TEST = nodeEnv === "test";

export const IS_SSR = () => typeof window === "undefined";
export const IS_BROWSER = () => typeof window !== "undefined";

export const ROOT_DIR = path.dirname(new URL(import.meta.url).pathname);
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");

export const LOGGING_REDACT_KEYS = [
  /token/i,
  /secret/i,
  /password/i,
  /authorization/i,
  /cookie/i,
  /auth_token/i,
  /api[_-]?key/i,
];
