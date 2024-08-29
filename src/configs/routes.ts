import { Route } from "@/types/route";

export const publicRoutes: Route[] = [
  {
    path: "/v1/auth/login",
    method: "POST",
  },
  {
    path: "/v1/auth/sso",
    method: "GET",
  },
  {
    path: "/v1/auth/callback",
    method: "GET",
  },
];
