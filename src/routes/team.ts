import { createTeam, getTeam, getTeams } from "@/services/team";
import { validateRequest } from "@/utils/validation";
import { CreateTeamSchema } from "@/validations/team";
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

export default app;
