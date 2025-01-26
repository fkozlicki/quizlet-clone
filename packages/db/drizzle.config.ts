import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

export default {
  schema: "./src/schema",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: "postgresql",
} satisfies Config;
