import { password } from "bun";
import { z } from "zod";

export const CreateCredentialSchema = z.object({
  username: z.string().nullish(),
  password: z.string().nullish(),
  hasSso: z.boolean(),
  note: z.string().nullish(),
});

export type CreateCredentialPayload = z.infer<typeof CreateCredentialSchema>;
