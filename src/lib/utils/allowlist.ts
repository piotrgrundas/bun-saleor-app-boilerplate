/**
 * Checks if a domain is in the allow list.
 * Supports wildcard "*" to allow all domains.
 * Supports glob patterns like "*.saleor.cloud".
 */
export function isDomainAllowed(domain: string, allowedDomains: string[]): boolean {
  return allowedDomains.some((pattern) => {
    if (pattern === "*") return true;

    if (pattern.startsWith("*.")) {
      const suffix = pattern.slice(1); // e.g., ".saleor.cloud"
      return domain.endsWith(suffix) || domain === pattern.slice(2);
    }

    return domain === pattern;
  });
}
