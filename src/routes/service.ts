import { APP_URL } from "@/configs/constant";
import {
  addServiceTeams,
  createService,
  deletedServiceTeams,
  getService,
  getServices,
} from "@/services/service";
import { JWT } from "@/types/jwt";
import { generateFileName, getFileExtension } from "@/utils/file";
import { validateRequest } from "@/utils/validation";
import {
  AddServiceTeamsSchema,
  CreateServiceSchema,
  DeleteServiceTeamsSchema,
} from "@/validations/service";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const claims = c.get("jwtPayload") as JWT;

  const result = await getServices(claims);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.get("/:id", async (c) => {
  const claims = c.get("jwtPayload") as JWT;
  const serviceId = c.req.param("id");

  const result = await getService(serviceId, claims);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.post("/upload", async (c) => {
  const { image } = await c.req.parseBody();

  if (image instanceof File) {
    const extension = getFileExtension(image);
    const fileName = generateFileName(extension);
    const path = `uploads/${fileName}`;
    await Bun.write(path, image);

    return c.json({
      data: {
        imageUrl: `${APP_URL}/${path}`,
      },
      message: "Success",
    });
  }
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
    const claims = c.get("jwtPayload") as JWT;
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await addServiceTeams(teamId, validated, claims);

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
    const claims = c.get("jwtPayload") as JWT;
    const teamId = c.req.param("id");
    const validated = c.req.valid("json");

    const result = await deletedServiceTeams(teamId, validated, claims);

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
