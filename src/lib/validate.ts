import { ZodSchema, ZodError } from "zod";

export function validate<T>(
  schema: ZodSchema<T>,
  data: T
): { errors: Partial<Record<keyof T, string[]>> | null } {
  try {
    schema.parse(data);
    return { errors: null };
  } catch (err) {
    if (err instanceof ZodError) {
      const validationErrors: Partial<Record<keyof T, string[]>> = {};
      err.errors.forEach((e) => {
        const field = e.path[0] as keyof T;
        validationErrors[field] = validationErrors[field] || [];
        validationErrors[field]!.push(e.message);
      });
      return { errors: validationErrors };
    }
    return { errors: {} };
  }
}
