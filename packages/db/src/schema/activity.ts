import { relations } from "drizzle-orm";
import { date, uuid } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { users } from "./auth";

export const activities = pgTable("activity", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  date: date("date").notNull().defaultNow(),
  userId: uuid("user_id").notNull(),
});

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));
