import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
