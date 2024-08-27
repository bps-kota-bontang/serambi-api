import { createMiddleware } from "hono/factory";

export const profiling = createMiddleware(async (c, next) => {
  await next();
  c.header("Document-Policy", "js-profiling");
});
