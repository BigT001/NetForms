"use server";

import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function createForm(data) {
  try {
    const result = await db
      .insert(jsonForms)
      .values({
        jsonform: data.jsonform,
        createdBy: data.createdBy,
        emailAddress: data.emailAddress,
        createdAt: new Date().toISOString(),
        theme: 'light', // Default theme
      })
      .returning({ id: jsonForms.id });

    return result[0].id;
  } catch (error) {
    console.error("Error in createForm action:", error);
    throw error;
  }
}

export async function updateFormThemeAndBackground(formId, theme, background) {
  try {
    console.log(
      "Updating form:",
      formId,
      "with theme:",
      theme,
      "and background:",
      background
    );

    const result = await db
      .update(jsonForms)
      .set({
        theme: theme,
        background: background,
      })
      .where(eq(jsonForms.id, formId))
      .returning({ id: jsonForms.id });

    console.log("Update result:", result);

    if (result.length === 0) {
      throw new Error("Form not found or update failed");
    }

    return result[0].id;
  } catch (error) {
    console.error("Error in updateFormThemeAndBackground action:", error);
    console.error("Error details:", error.message, error.stack);
    throw error;
  }
}