import { db } from "@/configs";
import { jsonForms, formSubmissions } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req, { params }) {
  try {
    const formId = parseInt(params.formId);
    
    console.log('Starting form deletion process for formId:', formId);
    
    // Delete the form
    const result = await db.delete(jsonForms).where(eq(jsonForms.id, formId));
    
    console.log('Deletion result:', result);

    return new Response(JSON.stringify({ message: "Form deleted successfully" }), {
      status: 200,
    });
  }
  catch (error) {
    console.error('Deletion error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
