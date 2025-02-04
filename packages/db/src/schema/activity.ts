import { relations } from "drizzle-orm";
import { date, pgTable, uuid } from "drizzle-orm/pg-core";

import { User } from "./user";

export const Activity = pgTable("activity", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  date: date().notNull().defaultNow(),
  userId: uuid()
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
});

export const ActivityRelations = relations(Activity, ({ one }) => ({
  user: one(User, {
    fields: [Activity.userId],
    references: [User.id],
  }),
}));
