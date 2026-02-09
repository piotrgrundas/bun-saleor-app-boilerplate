import { Hono } from "hono";

/**
 * Creates a minimal Hono app for testing routes.
 */
export function createTestApp() {
  return new Hono();
}
