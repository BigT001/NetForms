CREATE TABLE IF NOT EXISTS "formSubmissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonResponse" text NOT NULL,
	"createdBy" varchar(255) DEFAULT 'anonymus',
	"createdAt" varchar(255) NOT NULL,
	"form_id" uuid NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"data" jsonb NOT NULL
);
