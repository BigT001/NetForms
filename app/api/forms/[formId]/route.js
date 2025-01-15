import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req, { params }) {
  console.log('Delete request received for formId:', params.formId);
  
  try {
    const formId = parseInt(params.formId);
    console.log('Parsed formId:', formId);
    
    const result = await db.delete(jsonForms)
      .where(eq(jsonForms.id, formId))
      .returning();
      
    console.log('Delete operation result:', result);

    return new Response(JSON.stringify({ 
      message: "Form deleted successfully",
      result 
    }), {
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
