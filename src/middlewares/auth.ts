import { jwt } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import { JWT_SECRET } from "@/configs/constant";
import { publicRoutes } from "@/configs/routes";

export const auth = createMiddleware(async (c, next) => {
  const isPublicRoute = publicRoutes.some(
    (route) => route.path === c.req.path && route.method === c.req.method
  );

  if (isPublicRoute) {
    return next();
  }

  const jwtMiddleware = jwt({
    secret: JWT_SECRET,
  });

  return jwtMiddleware(c, next);
});
