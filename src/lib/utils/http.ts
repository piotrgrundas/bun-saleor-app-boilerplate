export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function ensureUrl(url: string): URL {
  return new URL(url);
}
