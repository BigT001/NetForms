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
import { useUser } from "@clerk/nextjs";
import { jsonForms } from "@/configs/schema";
import { db } from "@/configs/index";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { generateFormStructure } from "@/configs/AiModel";

const PROMPT = "On the basis of description, give forms in json format with form Heading, form title, form subheading, form name, and a 'fields' array containing objects with Field Type, Form field, placeholder name, form label, FormControl, required in json format."

export default function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const route = useRouter();

  const onCreateForm = async () => {
    console.log("Create form button clicked");
    setLoading(true);
  
    if (!userInput.trim()) {
      toast.error("Please provide a description for the form.");
      setLoading(false);
      return;
    }
  
    try {
      const formData = await generateFormStructure(userInput);
      console.log("Structured form data:", formData);
    
    
      if (!formData || typeof formData !== 'object') {
        throw new Error('Invalid form data received from AI');
      }
  

      const finalResponse = {
        response: [formData],
        formStructure: {
          fields: formData.fields || [],
          formTitle: formData.formTitle || formData.formHeading || "Untitled Form",
          formSubheading: formData.formSubheading || "",
          formName: formData.formName || ""
        }
      };

      console.log("Final response:", finalResponse);

      const resp = await db.insert(jsonForms)
        .values({
          jsonform: JSON.stringify(finalResponse),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/yyyy"),
        })
        .returning({ id: jsonForms.id });

      if (resp[0].id) {
        console.log("Form created successfully. Navigating to edit page.");
        route.push("/edit-form/" + resp[0].id);
        setOpenDialog(false);
        toast.success("Form created successfully!");
      } else {
        throw new Error('Failed to insert form into database');
      }

    } catch (error) {
      console.error("Error creating form:", error);
      toast.error("Unable to generate form structure. Please try rephrasing your description.");
      setLoading(false);
    }
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
                  onClick={onCreateForm}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Create"}
                </Button>
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
