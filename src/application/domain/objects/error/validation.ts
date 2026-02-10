export interface ValidationIssue {
  message: string;
  path: PropertyKey[];
  code?: string;
}

export interface ValidationErrorDefs {
  VALIDATION_ERROR: { issues: ValidationIssue[] };
}
export type ValidationErrorCode = keyof ValidationErrorDefs;
