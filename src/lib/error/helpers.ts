import { HttpError } from "./base";

export const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof HttpError;
};

export const getErrorMessage = (error: unknown, fallback = "Unknown error"): string => {
  return error instanceof Error ? error.message : fallback;
};
