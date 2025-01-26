import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing process.env.DATABASE_URL");
}

let url = process.env.DATABASE_URL;
if (process.env.NODE_ENV === "development") {
  url = "postgres://postgres:postgres@db.localtest.me:5432/main";
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
    return `${protocol}://${host}:${port}/sql`;
  };
}
const sql = neon(url);

export const db = drizzle({ client: sql, schema });

export type Database = typeof db;
