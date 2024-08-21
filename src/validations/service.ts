import { z } from "zod";

export const CreateServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().nullable(),
  link: z.string().min(1),
  tags: z.array(z.string()).min(1),
});

export type CreateServicePayload = z.infer<typeof CreateServiceSchema>;

export const AddServiceTeamsSchema = z
  .array(
    z.object({
      teamId: z.string()
    })
  )
  .min(1);

export type AddServiceTeamsPayload = z.infer<typeof AddServiceTeamsSchema>;

export const DeleteServiceTeamsSchema = z
  .array(
    z.object({
      teamId: z.string(),
    })
  )
  .min(1);

export type DeleteServiceTeamsPayload = z.infer<typeof DeleteServiceTeamsSchema>;

