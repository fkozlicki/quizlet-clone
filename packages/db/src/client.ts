import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing process.env.POSTGRES_URL");
}

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export const db = drizzle({ client: pool, schema, casing: "snake_case" });

export type Schema = typeof schema;

export type Database = typeof db;

export type Transaction = PgTransaction<
  NeonQueryResultHKT,
  Schema,
  ExtractTablesWithRelations<Schema>
>;
