const { pgTable, serial, text, varchar } = require("drizzle-orm/pg-core");

export const jsonForms = pgTable("jsonForms", {
  id: serial("id").primaryKey(),
  jsonform: text("jsonform").notNull(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
});
