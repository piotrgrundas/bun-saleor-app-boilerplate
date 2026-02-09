/**
 * Creates a mock request for testing Hono routes.
 */
export function createTestRequest(path: string, options: RequestInit = {}): Request {
  const url = `http://localhost${path}`;
  return new Request(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
