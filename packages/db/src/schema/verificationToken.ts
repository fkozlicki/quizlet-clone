import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const VerificationToken = pgTable(
  "verificationToken",
  {
    identifier: varchar({ length: 255 }).notNull(),
    token: varchar({ length: 255 }).notNull(),
    expires: timestamp({ mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
