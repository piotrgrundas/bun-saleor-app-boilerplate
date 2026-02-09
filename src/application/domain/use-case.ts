import type { Result } from "neverthrow";

import type { Error as DomainError, ErrorCode } from "./objects/error";

export interface UseCase<TInput, TOutput, TErrorCode extends ErrorCode = ErrorCode> {
  execute(input: TInput): Promise<Result<TOutput, DomainError<TErrorCode>>>;
}
