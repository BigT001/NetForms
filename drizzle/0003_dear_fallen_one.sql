ALTER TABLE "formSubmissions" DROP CONSTRAINT "formSubmissions_formId_jsonForms_id_fk";
--> statement-breakpoint
ALTER TABLE "formSubmissions" ALTER COLUMN "formId" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formSubmissions" ADD CONSTRAINT "formSubmissions_formId_jsonForms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."jsonForms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
