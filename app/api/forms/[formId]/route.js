import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req, { params }) {
  try {
    const formId = parseInt(params.formId);
    
    // Using a transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      return await tx.delete(jsonForms).where(eq(jsonForms.id, formId));
    });

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
