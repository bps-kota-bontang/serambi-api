import { addServiceTeams, createService, deletedServiceTeams, getService, getServices } from "@/services/service";
import { validateRequest } from "@/utils/validation";
import { AddServiceTeamsSchema, CreateServiceSchema, DeleteServiceTeamsSchema } from "@/validations/service";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const result = await getServices();

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.get("/:id", async (c) => {
  const serviceId = c.req.param("id");

  const result = await getService(serviceId);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.post("/", validateRequest("json", CreateServiceSchema), async (c) => {
  const validated = c.req.valid("json");

  const result = await createService(validated);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.post(
  "/:id/teams",
  validateRequest("json", AddServiceTeamsSchema),
  async (c) => {
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await addServiceTeams(teamId, validated);

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
  "/:id/teams",
  validateRequest("json", DeleteServiceTeamsSchema),
  async (c) => {
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await deletedServiceTeams(teamId, validated);

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
