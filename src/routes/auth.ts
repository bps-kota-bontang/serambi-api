import { COOKIE_SECRET, JWT_DURATION } from "@/configs/constant";
import { login } from "@/services/auth";
import { validateRequest } from "@/utils/validation";
import { LoginSchema } from "@/validations/auth";
import { Hono } from "hono";
import { setSignedCookie } from "hono/cookie";

const app = new Hono();

app.post("/login", validateRequest("json", LoginSchema), async (c) => {
  const appType = c.req.header("X-App-Type");
  const validated = c.req.valid("json");

  const result = await login(validated.email, validated.password);

  if (appType == "web" && result.code == 200) {
    await setSignedCookie(c, "token", result.data.token, COOKIE_SECRET, {
      expires: new Date(Date.now() + JWT_DURATION * 1000),
      httpOnly: true,
      maxAge: JWT_DURATION,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });
  }

  return c.json(
    {
      data: result.data,
      message: result.message,
    },
    result.code
  );
});

export default app;
