import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import v1 from "@/api/v1";
import { auth } from "@/middlewares/auth";
import { corsOptions } from "@/configs/cors";

const app = new Hono();

app.use(prettyJSON());
app.use(cors(corsOptions));
app.use(logger());
app.use("/uploads/*", serveStatic({ root: "./" }));
app.use("/v1/*", auth);
app.route("/v1", v1);

app.notFound((c) => {
  return c.json(
    {
      message: "invalid endpoint",
      data: null,
    },
    404
  );
});

app.onError((err, c) => {
  return c.json(
    {
      message: err.message,
      data: null,
    },
    500
  );
});

export default app;
