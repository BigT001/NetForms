"use server";

import { db } from "@/lib/db";
import { jsonform } from "@/configs/schema";

export async function createForm(data) {
  try {
    const result = await db
      .insert(jsonform)
      .values({
        jsonform: data.jsonform,
        createdBy: data.createdBy,
        emailAddress: data.emailAddress,
        createdAt: new Date(),
      })
      .returning({ id: jsonform.id });

    return result[0].id;
  } catch (error) {
    console.error("Error in createForm action:", error);
    throw error;
  }
}
