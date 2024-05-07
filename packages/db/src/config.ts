import type { Config } from "drizzle-kit";

const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

export default {
  schema: "./src/schema",
  driver: "pg",
  dbCredentials: {
    connectionString,
  },
  tablesFilter: ["t3turbo_*"],
} satisfies Config;
