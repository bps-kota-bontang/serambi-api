import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodSchema } from "zod";

export const validateRequest = <T extends keyof ValidationTargets>(
  taget: T,
  schema: ZodSchema
) => {
  return zValidator(taget, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          errors: result.error.issues,
          data: null,
          message: "Invalid payload",
        },
        400
      );
    }
  });
};
