export class GraphQLClientError extends Error {
  public readonly errors: Array<{ message: string; path?: Array<string | number> }>;

  constructor(errors: Array<{ message: string; path?: Array<string | number> }>) {
    const messages = errors.map((e) => {
      const path = e.path ? ` (at ${e.path.join(".")})` : "";
      return `${e.message}${path}`;
    });

    super(`GraphQL errors: ${messages.join("; ")}`);
    this.errors = errors;
  }
}
