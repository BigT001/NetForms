CREATE TABLE IF NOT EXISTS "formSubmissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonResponse" text NOT NULL,
	"createdBy" varchar(255) DEFAULT 'anonymus',
	"createdAt" varchar(255) NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jsonForms" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonform" text NOT NULL,
	"theme" varchar,
	"background" varchar,
	"style" varchar,
	"createdBy" varchar(255) NOT NULL,
	"createdAt" varchar(255) NOT NULL
);
