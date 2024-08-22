import {
  addTeamUsers,
  createTeam,
  deletedTeamUsers,
  getTeam,
  getTeams,
  updatedTeamUsers,
} from "@/services/team";
import { JWT } from "@/types/jwt";
import { validateRequest } from "@/utils/validation";
import {
  AddTeamUsersSchema,
  CreateTeamSchema,
  DeleteTeamUsersSchema,
  UpdateTeamUsersSchema,
} from "@/validations/team";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const claims = c.get("jwtPayload") as JWT;
  const type = c.req.query("type");

  let result;
  if (type == "all") {
    result = await getTeams();
  } else {
    result = await getTeams(claims);
  }


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
  const claims = c.get("jwtPayload") as JWT;
  const validated = c.req.valid("json");

  const result = await createTeam(validated, claims);

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
    const claims = c.get("jwtPayload") as JWT;
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await addTeamUsers(teamId, validated, claims);

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
    const claims = c.get("jwtPayload") as JWT;
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await deletedTeamUsers(teamId, validated, claims);

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
    const claims = c.get("jwtPayload") as JWT;
    const teamId = c.req.param("teamId");
    const userId = c.req.param("userId");
    const validated = c.req.valid("json");

    const result = await updatedTeamUsers(teamId, userId, validated, claims);

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
