import { relations } from "drizzle-orm";
import { date, pgTable, uuid } from "drizzle-orm/pg-core";

import { User } from "./user";

export const Activity = pgTable("activities", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  date: date("date").notNull().defaultNow(),
  userId: uuid("userId")
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
});

export const ActivityRelations = relations(Activity, ({ one }) => ({
  user: one(User, {
    fields: [Activity.userId],
    references: [User.id],
  }),
}));
