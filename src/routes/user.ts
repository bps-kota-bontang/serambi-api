import { getUser, getUsers } from "@/services/user";
import { JWT } from "@/types/jwt";
import { Hono } from "hono";

const app = new Hono();

app.get("/me", async (c) => {
  const claims = c.get("jwtPayload") as JWT;
  const result = await getUser(claims.sub);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.get("/", async (c) => {
  const result = await getUsers();

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

app.get("/:id", async (c) => {
  const userId = c.req.param('id');

  const result = await getUser(userId);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

export default app;
