ALTER TABLE "formSubmissions" ADD COLUMN "form_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formSubmissions" ADD CONSTRAINT "formSubmissions_form_id_jsonForms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."jsonForms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
