const { pgTable, serial, text, varchar, timestamp, jsonb, uuid } = require("drizzle-orm/pg-core");

export const jsonForms = pgTable("jsonForms", {
  id: serial("id").primaryKey(),
  jsonform: text("jsonform").notNull(),
  theme: varchar("theme"),
  background: varchar("background"),
  style: varchar("style"),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
});


export const formSubmissions = pgTable('formSubmissions', {
  id: serial('id').primaryKey(),
  jsonResponse:text('jsonResponse').notNull(),
  createdBy: varchar("createdBy", { length: 255 }).default('anonymus'),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
  formId: uuid('form_id').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),
  data: jsonb('data').notNull()
});