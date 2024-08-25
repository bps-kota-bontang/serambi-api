import { APP_ENV, ORIGIN } from "@/configs/constant";

export const csrfOptions = {
  origin:
    APP_ENV === "development"
      ? ["http://localhost:5173", "http://localhost:4173"]
      : ORIGIN,
};
