import { z } from "zod";

export const CreateServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  link: z.string().min(1),
  tags: z.array(z.string()).min(1),
});

export type CreateServicePayload = z.infer<typeof CreateServiceSchema>;
