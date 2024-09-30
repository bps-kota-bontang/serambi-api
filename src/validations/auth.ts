import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export type LoginPayload = z.infer<typeof LoginSchema>;

export const CallbackAuthSchema = z.object({
  state: z.string().min(1),
  token: z.string().min(1).nullish(),
  action: z.string().min(1).nullish(),
});

export type CallbackAuthPayload = z.infer<typeof CallbackAuthSchema>;
