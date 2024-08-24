import { APP_ENV, CORS_ORIGIN } from "@/configs/constant";

export const corsOptions = {
  origin:
    APP_ENV === "development"
      ? ["http://localhost:5173", "http://localhost:4173"]
      : CORS_ORIGIN,
  credentials: true,
};
