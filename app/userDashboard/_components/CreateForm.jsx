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

const PROMPT =
  "on the bases of description, give forms in json format with form title, FieldType, form subheading, form field, form name, placeholder name, and form lable in json format";

export default function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState();
  const { user } = useUser();
  const route = useRouter();

  const onCreateForm = async () => {

    setLoading(true)
    const result = await AiChatSession.sendMessage(
      "Description:" + userInput + PROMPT);
      
    console.log(result.response.text());
    if (result.response.text()) 
  {
    
        const resp = await db.insert(jsonForms)
        .values({
          jsonform: result.response.text(),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/yyyy"),
        })
        .returning({ id: jsonForms.id });
  
      console.log("New Form ID", resp[0].id);
      if (resp[0].id) 
      {
        route.push("/edit-form/" + resp[0].id);
      }
      setLoading(false);
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
                  {loading ? <Loader2 className="animate-spin" /> : ""}
                  create
                </Button>
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
