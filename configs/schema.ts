const { pgTable, serial, text, varchar } = require("drizzle-orm/pg-core");

export const jsonForms = pgTable("jsonForms", {
  id: serial("id").primaryKey(),
  jsonform: text("jsonform").notNull(),
  theme: varchar("theme"),
  background: varchar("background"),
  style: varchar("style"),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
});
