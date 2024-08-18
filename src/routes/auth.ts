import { login } from "@/services/auth";
import { validateRequest } from "@/utils/validation";
import { LoginSchema } from "@/validations/auth";
import { Hono } from "hono";

const app = new Hono();

app.post("/login", validateRequest("json", LoginSchema), async (c) => {
  const validated = c.req.valid("json");

  const result = await login(validated.email, validated.password);

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

export default app;
