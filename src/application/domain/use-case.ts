import type { DomainErrorCode } from "./objects/error";
import type { AsyncDomainResult } from "./objects/result";

export interface UseCase<TInput, TOutput, TErrorCode extends DomainErrorCode = DomainErrorCode> {
  execute(input: TInput): AsyncDomainResult<TOutput, TErrorCode>;
}
