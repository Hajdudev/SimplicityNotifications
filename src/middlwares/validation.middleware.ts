import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export const _zodErrorToApiResponse = (zodError: ZodError) => {
  const validationError = fromZodError(zodError);
  return validationError.toString();
};
