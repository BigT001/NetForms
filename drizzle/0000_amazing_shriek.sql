CREATE TABLE IF NOT EXISTS "jsonForms" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonform" text NOT NULL,
	"theme" varchar,
	"background" varchar,
	"style" varchar,
	"createdBy" varchar(255) NOT NULL,
	"createdAt" varchar(255) NOT NULL
);
