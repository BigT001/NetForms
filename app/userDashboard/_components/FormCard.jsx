import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Share2, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import moment from "moment";
import { toast } from "react-hot-toast";

const extractStringValue = (obj) => {
  if (typeof obj === "string") return obj;
  if (obj && typeof obj === "object") {
    if ("value" in obj) return obj.value;
    if ("label" in obj) return obj.label;
  }
  return "";
};

function FormCard({ form, user, onDelete }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formData = form.jsonform ? JSON.parse(form.jsonform) : null;
  const formTitle =
    extractStringValue(formData?.response[0]?.formTitle) || "Untitled Form";
  const formSubheading =
    extractStringValue(formData?.response[0]?.formSubheading) || "";
  const createdAt = form.createdAt
    ? moment(form.createdAt, "DD/MM/YYYY").format("MMM D, YYYY")
    : "Unknown date";

  const handleEdit = () => {
    router.push(`/edit-form/${form.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(form.id);
      setIsDeleteDialogOpen(false);
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error(`Failed to delete form: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden relative w-full h-full flex flex-col">
        <div className="absolute top-2 right-2">
          <Trash2
            className="h-5 w-5 text-primary cursor-pointer hover:text-red-700"
            onClick={() => setIsDeleteDialogOpen(true)}
          />
        </div>
        <div className="px-4 mt-4 flex-grow">
          <h3 className="text-lg font-semibold mb-2 mt-2">{formTitle}</h3>
          <p className="text-sm text-gray-600 mb-2">{formSubheading}</p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created on {createdAt}</span>
          </div>
        </div>
        <div className="p-4 mt-auto">
          <hr className="mb-4" />
          <div className="flex justify-between">
            <Button
              size="sm"
              className="flex gap-2 bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            <RWebShare
              data={{
                text: `${formSubheading}, Build your forms in seconds with NetForms`,
                url: `${process.env.NEXT_PUBLIC_BASE_URL}netforms/${form.id}`,
                title: formTitle,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button
                size="sm"
                className="flex gap-2 bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </RWebShare>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form? User responses will
              also be deleted!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              className="bg-primary"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FormCard;
