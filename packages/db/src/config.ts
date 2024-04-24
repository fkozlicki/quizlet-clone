import type { Config } from "drizzle-kit";

const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?schema=public`;

export default {
  schema: "./src/schema",
  driver: "pg",
  dbCredentials: {
    connectionString,
  },
  tablesFilter: ["t3turbo_*"],
} satisfies Config;
