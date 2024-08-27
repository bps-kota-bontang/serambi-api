import { z } from "zod";

export const UpdateUserPasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmNewPassword: z.string().min(1),
});

export type UpdateUserPasswordPayload = z.infer<
  typeof UpdateUserPasswordSchema
>;
