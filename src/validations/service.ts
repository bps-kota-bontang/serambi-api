import { z } from "zod";
import { CreateCredentialSchema } from "./credential";

export const GetServiceSchema = z.object({
  keyword: z.string().nullish(),
  tags: z.string().nullish(),
  page: z.string().nullish(),
  limit: z.string().nullish(),
});

export type GetServicePayload = z.infer<typeof GetServiceSchema>;

export const AddServiceTeamsSchema = z
  .array(
    z.object({
      teamId: z.string(),
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

export type DeleteServiceTeamsPayload = z.infer<
  typeof DeleteServiceTeamsSchema
>;

export const CreateServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().nullable(),
  link: z.string().min(1),
  tags: z.array(z.string()),
  teams: AddServiceTeamsSchema,
  credential: CreateCredentialSchema
});

export type CreateServicePayload = z.infer<typeof CreateServiceSchema>;
