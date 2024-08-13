import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./configs/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://Ai-form-Builder_owner:GHyUvzj9sT1I@ep-bitter-mountain-a5k8ijqs.us-east-2.aws.neon.tech/Ai-form-Builder?sslmode=require",
  },
});
