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

export default function CreateForm({ setIsOpen }) {
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
          formHeading: formData.formHeading || formData.formHeading || "Untitled Form",
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpenDialog} className="w-44">
        + Create Form
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog} className="">
        <DialogContent className="sm:max-w-[425px] max-w-[90%] w-full">
          <DialogHeader>
            <DialogTitle>Create new form</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Textarea
              className="my-2 w-full"
              onChange={(event) => setUserInput(event.target.value)}
              placeholder="Write your form description"
              value={userInput}
            />
            <div className="flex gap-2 justify-end mt-4">
              <Button onClick={() => setOpenDialog(false)} variant="outline">
                Cancel
              </Button>
              <Button
                disabled={loading}
                className="bg-primary hover:bg-secondary"
                onClick={onCreateForm}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}