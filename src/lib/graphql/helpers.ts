/**
 * Extracts the operation name from a GraphQL document string.
 */
export function getOperationName(query: string): string | null {
  const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/);
  return match?.[1] ?? null;
}
