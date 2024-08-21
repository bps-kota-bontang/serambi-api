export const APP_URL = Bun.env.APP_URL || "http://localhost:3000";
export const CORS_ORIGIN = Bun.env.CORS_ORIGIN || ["http://localhost:5173", "http://localhost:4173"];
export const DATABASE_URL = Bun.env.DATABASE_URL || "postgresql://user:password@localhost:5432/serambi_db?schema=public";
export const JWT_SECRET = Bun.env.JWT_SECRET || "password";
export const JWT_DURATION = parseInt(Bun.env.JWT_DURATION ?? "3600");
export const NODE_ENV = Bun.env.NODE_ENV || "development";