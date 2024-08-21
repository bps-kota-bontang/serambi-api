import { CORS_ORIGIN, NODE_ENV } from "@/configs/constant";

export const corsOptions = {
  origin:
    NODE_ENV === "development"
      ? ["http://localhost:5173", "http://localhost:4173"]
      : CORS_ORIGIN,
  credentials: true,
};
