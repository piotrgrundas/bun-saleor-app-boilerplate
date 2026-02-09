import type { z } from "zod";

interface PrepareConfigOptions<T extends z.ZodTypeAny> {
  name: string;
  schema: T;
}

export const prepareConfig = <T extends z.ZodTypeAny>(
  options: PrepareConfigOptions<T>,
): z.infer<T> => {
  const result = options.schema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`[${options.name}] Configuration validation failed:\n${errors}`);
  }

  return result.data;
};
