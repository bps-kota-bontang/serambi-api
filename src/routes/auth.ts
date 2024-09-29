import {
  APP_URL,
  CLIENT_URL,
  COOKIE_SECRET,
  GATE_SERVICE_ID,
  GATE_URL,
  JWT_DURATION,
} from "@/configs/constant";
import { login, loginSso } from "@/services/auth";
import { generateState } from "@/utils/crypto";
import { validateRequest } from "@/utils/validation";
import {
  CallbackAuthPayload,
  CallbackAuthSchema,
  LoginSchema,
} from "@/validations/auth";
import { Hono } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";

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

app.get("/sso", async (c) => {
  const state = generateState();

  await setSignedCookie(c, "state", state, COOKIE_SECRET, {
    expires: new Date(Date.now() + 300 * 1000),
    httpOnly: true,
    maxAge: 300,
    path: "/",
    secure: true,
    sameSite: "Lax",
  });

  return c.redirect(
    `${GATE_URL}/api/v1/auth/sso?state=${state}&service_id=${GATE_SERVICE_ID}`
  );
});

app.get(
  "/callback",
  validateRequest("query", CallbackAuthSchema),
  async (c) => {
    const validated = c.req.valid("query") as CallbackAuthPayload;

    const cookieState = await getSignedCookie(c, COOKIE_SECRET, "state");

    if (cookieState !== validated.state) {
      return c.redirect(CLIENT_URL + "/login?error=invalid_state");
    }

    const result = await loginSso(validated.token);

    if (result.code != 200) {
      return c.redirect(CLIENT_URL + "/login?error=user_not_found");
    }

    await setSignedCookie(c, "token", result.data.token, COOKIE_SECRET, {
      expires: new Date(Date.now() + JWT_DURATION * 1000),
      httpOnly: true,
      maxAge: JWT_DURATION,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    return c.redirect(CLIENT_URL + "/login");
  }
);

app.post("/logout", async (c) => {
  deleteCookie(c, "state");
  deleteCookie(c, "token");

  return c.json(
    {
      data: null,
      message: "Successfully logged out",
    },
    200
  );
});

export default app;
