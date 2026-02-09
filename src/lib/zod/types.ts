import type { z } from "zod";

export type InferSchema<T extends z.ZodTypeAny> = z.infer<T>;
