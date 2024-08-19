import { addTeamUsers, createTeam, deletedTeamUsers, getTeam, getTeams, updatedTeamUsers } from "@/services/team";
import { validateRequest } from "@/utils/validation";
import { AddTeamUsersSchema, CreateTeamSchema, DeleteTeamUsersSchema, UpdateTeamUsersSchema } from "@/validations/team";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const result = await getTeams();

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.get("/:id", async (c) => {
  const teamId = c.req.param("id");

  const result = await getTeam(teamId);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.post("/", validateRequest("json", CreateTeamSchema), async (c) => {
  const validated = c.req.valid("json");

  const result = await createTeam(validated);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.post(
  "/:id/users",
  validateRequest("json", AddTeamUsersSchema),
  async (c) => {
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await addTeamUsers(teamId, validated);

    return c.json(
      {
        data: result.data,
        message: result.message,
      },
      result.code
    );
  }
);

app.delete(
  "/:id/users",
  validateRequest("json", DeleteTeamUsersSchema),
  async (c) => {
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await deletedTeamUsers(teamId, validated);

    return c.json(
      {
        data: result.data,
        message: result.message,
      },
      result.code
    );
  }
);

app.put(
  "/:teamId/users/:userId",
  validateRequest("json", UpdateTeamUsersSchema),
  async (c) => {
    const teamId = c.req.param("teamId");
    const userId = c.req.param("userId");
    const validated = c.req.valid("json");

    const result = await updatedTeamUsers(teamId, userId, validated);

    return c.json(
      {
        data: result.data,
        message: result.message,
      },
      result.code
    );
  }
);

export default app;
