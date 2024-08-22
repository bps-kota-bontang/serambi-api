import { password } from "bun";
import { z } from "zod";

export const CreateCredentialSchema = z.object({
  username: z.string().nullable(),
  password: z.string().nullable(),
  hasSso: z.boolean(),
  note: z.string().nullable(),
});

export type CreateCredentialPayload = z.infer<typeof CreateCredentialSchema>;
