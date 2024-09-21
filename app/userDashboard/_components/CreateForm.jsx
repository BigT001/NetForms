"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "@/configs/AiModel";
import { useUser } from "@clerk/nextjs";
import { jsonForms } from "@/configs/schema";
import { db } from "@/configs/index";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PROMPT = "On the basis of description, give forms in json format with form Heading, form title, form subheading, form name, and a 'fields' array containing objects with Field Type, Form field, placeholder name, form label, FormControl, required in json format."
/**
 * Renders a dialog component that allows the user to create a new form.
 * 
 * The dialog contains a textarea for the user to input a form description, and
 * buttons to cancel or create the form. When the user clicks the "create" button,
 * the `onCreateForm` function is called, which sends the user's input to an AI
 * model to generate a JSON representation of the form, and then saves the form
 * to the database.
 * 
 * The `CreateForm` component uses the `useUser` hook from the `@clerk/nextjs`
 * library to get the current user's information, and the `useRouter` hook from
 * the `next/navigation` library to navigate to the form editor page after the
 * form is created.
 */
export default function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState();
  const { user } = useUser();
  const route = useRouter();

  const onCreateForm = async () => {
    setLoading(true);
    const result = await AiChatSession.sendMessage("Description:" + userInput + PROMPT);
    if (result.response) {
      let formattedResponse;
      try {
        formattedResponse = JSON.parse(result.response.text());
        // Ensure the response has the correct structure
        if (!formattedResponse.response) {
          formattedResponse = { response: [formattedResponse] };
        }
      } catch (error) {
        console.error("Failed to parse AI response:", error);
        setLoading(false);
        return;
      }
      
      const resp = await db.insert(jsonForms)
        .values({
          jsonform: JSON.stringify(formattedResponse),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/yyyy"),
        })
        .returning({ id: jsonForms.id });
      
      if (resp[0].id) {
        route.push("/edit-form/" + resp[0].id);
      }
    }
    setLoading(false);
  };
  


  return (
    <div>
      <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <div>
            <DialogTitle>Create new form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="my-2"
                onChange={(event) => setUserInput(event.target.value)}
                placeholder="Write your form description"
                value={userInput}
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button
                  disabled={loading}
                  className="bg-blue-800 hover:bg-blue-800"
                  onClick={() => onCreateForm()}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "create"}
                  
                </Button>
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
