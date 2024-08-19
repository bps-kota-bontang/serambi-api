import { z } from "zod";

export const CreateTeamSchema = z.object({
  name: z.string().min(1),
});

export type CreateTeamPayload = z.infer<typeof CreateTeamSchema>;

export const AddTeamUsersSchema = z
  .array(
    z.object({
      userId: z.string(),
      isAdmin: z.boolean().default(false),
    })
  )
  .min(1);

export type AddTeamUsersPayload = z.infer<typeof AddTeamUsersSchema>;

export const DeleteTeamUsersSchema = z
  .array(
    z.object({
      userId: z.string(),
    })
  )
  .min(1);

export type DeleteTeamUsersPayload = z.infer<typeof DeleteTeamUsersSchema>;

export const UpdateTeamUsersSchema = z.object({
  isAdmin: z.boolean(),
});

export type UpdateTeamUsersPayload = z.infer<typeof UpdateTeamUsersSchema>;
