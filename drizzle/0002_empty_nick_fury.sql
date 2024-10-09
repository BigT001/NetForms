ALTER TABLE "formSubmissions" RENAME COLUMN "form_id" TO "formId";--> statement-breakpoint
ALTER TABLE "formSubmissions" DROP CONSTRAINT "formSubmissions_form_id_jsonForms_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formSubmissions" ADD CONSTRAINT "formSubmissions_formId_jsonForms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."jsonForms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
