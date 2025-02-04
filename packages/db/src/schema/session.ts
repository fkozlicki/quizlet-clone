import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { User } from "./user";

export const Session = pgTable("session", {
  sessionToken: varchar({ length: 255 }).notNull().primaryKey(),
  userId: uuid().notNull(),
  expires: timestamp({ mode: "date" }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
