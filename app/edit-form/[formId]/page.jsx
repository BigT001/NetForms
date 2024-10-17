"use client";

import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import { ArrowLeft, Share2, SquareArrowUpRight, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import FormUi from "../_components/FormUi";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import Control from "../_components/Control";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RWebShare } from "react-web-share";

function EdithForm({ params }) {
  const { user } = useUser();
  const [jsonform, setJsonForm] = useState(null);
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedGradient, setSelectedGradient] = useState("");
  const [isControlVisible, setIsControlVisible] = useState(false);

  useEffect(() => {
    if (user) {
      GetFormData();
    }
  }, [user]);

  const GetFormData = async () => {
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(
          and(
            eq(jsonForms.id, params?.formId),
            eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      if (result && result.length > 0 && result[0].jsonform) {
        const parsedForm = JSON.parse(result[0].jsonform);
        setJsonForm(parsedForm);
        setRecord(result[0]);
        setSelectedTheme(result[0].theme || "light");
        setSelectedGradient(result[0].background || "");
      } else {
        console.error("No form data found");
        setJsonForm(null);
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
      setJsonForm(null);
    }
  };

  const debouncedUpdateDb = useCallback(
    debounce(async (updatedJsonForm, theme, background) => {
      if (!record) return;
      try {
        await db
          .update(jsonForms)
          .set({
            jsonform: JSON.stringify(updatedJsonForm),
            theme: theme,
            background: background,
          })
          .where(
            and(
              eq(jsonForms.id, record.id),
              eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
            )
          );
        // toast.success("Form updated in database");
      } catch (error) {
        console.error("Error in database operation:", error);
        toast.error("Failed to update form in database");
      }
    }, 1000),
    [record, user]
  );

  const onFieldUpdate = (updatedField, index) => {
    setJsonForm((prevForm) => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      if (!updatedForm.response || !updatedForm.response[0]) {
        updatedForm.response = [{ fields: [] }];
      }
      if (!updatedForm.response[0].fields) {
        updatedForm.response[0].fields = [];
      }
      updatedForm.response[0].fields[index] = updatedField;
      debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
      toast.success("Field updated successfully");
      return updatedForm;
    });
  };

  const onFormDetailsUpdate = (key, value) => {
    setJsonForm((prevForm) => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      if (!updatedForm.response || !updatedForm.response[0]) {
        updatedForm.response = [{}];
      }
      updatedForm.response[0][key] = value;
      debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
      toast.success("Form details updated successfully");
      return updatedForm;
    });
  };

  const onFieldDelete = async (index) => {
    setJsonForm((prevForm) => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      updatedForm.response[0].fields.splice(index, 1);
      debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
      toast.success("Field deleted successfully");
      return updatedForm;
    });
  };

  const onFieldDuplicate = (index) => {
    setJsonForm((prevForm) => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      const fieldToDuplicate = updatedForm.response[0].fields[index];
      const duplicatedField = { ...fieldToDuplicate, id: Date.now() };
      updatedForm.response[0].fields.splice(index + 1, 0, duplicatedField);
      debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
      toast.success("Field duplicated successfully");
      return updatedForm;
    });
  };

  const onFieldAdd = (newField) => {
    setJsonForm((prevForm) => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      if (!updatedForm.response) {
        updatedForm.response = [];
      }
      if (
        !updatedForm.response[0] ||
        typeof updatedForm.response[0] === "string"
      ) {
        updatedForm.response[0] = {};
      }
      if (!updatedForm.response[0].fields) {
        updatedForm.response[0].fields = [];
      }
      updatedForm.response[0].fields.push(newField);
      debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
      toast.success("New field added successfully");
      return updatedForm;
    });
  };

  const extractStringValue = (obj) => {
    if (typeof obj === "string") return obj;
    if (obj && typeof obj === "object") {
      if ("value" in obj) return obj.value;
      if ("label" in obj) return obj.label;
    }
    return "";
  };

  const { formTitle, formSubheading, createdAt } = useMemo(() => {
    if (!record)
      return {
        formTitle: "Untitled Form",
        formSubheading: "",
        createdAt: "Unknown date",
      };

    const formData = record.jsonform ? JSON.parse(record.jsonform) : null;
    return {
      formTitle:
        extractStringValue(formData?.response[0]?.formTitle) || "Untitled Form",
      formSubheading:
        extractStringValue(formData?.response[0]?.formSubheading) || "",
      // createdAt: record.createdAt
      //   ? moment(record.createdAt, "DD/MM/YYYY").format("MMM D, YYYY")
      //   : "Unknown date"
    };
  }, [record]);

  const handleAddField = (newField) => {
    setJsonForm((prevForm) => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      if (!updatedForm.response) {
        updatedForm.response = [];
      }
      if (
        !updatedForm.response[0] ||
        typeof updatedForm.response[0] === "string"
      ) {
        updatedForm.response[0] = {};
      }
      if (!updatedForm.response[0].fields) {
        updatedForm.response[0].fields = [];
      }
      updatedForm.response[0].fields.push(newField);
      debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
      toast.success("New field added successfully");
      return updatedForm;
    });
  };

  const onFormTitleUpdate = useCallback(
    (newTitle) => {
      setJsonForm((prevForm) => {
        const updatedForm = JSON.parse(JSON.stringify(prevForm));
        updatedForm.response[0].formTitle = newTitle;
        debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
        return updatedForm;
      });
    },
    [debouncedUpdateDb, selectedTheme, selectedGradient]
  );

  const onFormDescriptionUpdate = useCallback(
    (newDescription) => {
      setJsonForm((prevForm) => {
        const updatedForm = JSON.parse(JSON.stringify(prevForm));
        updatedForm.response[0].formDescription = newDescription;
        debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
        return updatedForm;
      });
    },
    [debouncedUpdateDb, selectedTheme, selectedGradient]
  );

  const onFormSubheadingUpdate = useCallback(
    (newSubheading) => {
      setJsonForm((prevForm) => {
        const updatedForm = JSON.parse(JSON.stringify(prevForm));
        updatedForm.response[0].formSubheading = newSubheading;
        debouncedUpdateDb(updatedForm, selectedTheme, selectedGradient);
        return updatedForm;
      });
    },
    [debouncedUpdateDb, selectedTheme, selectedGradient]
  );

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    debouncedUpdateDb(jsonform, theme, selectedGradient);
  };

  const handleGradientChange = (gradient) => {
    setSelectedGradient(gradient);
    debouncedUpdateDb(jsonform, selectedTheme, gradient);
  };

  const toggleControl = () => {
    setIsControlVisible(!isControlVisible);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 lg:pl-[calc(25%+2rem)]">
      <div className="flex justify-between items-center mt-2 mb-4">
        <Button
          variant="ghost"
          className="flex gap-2 items-center cursor-pointer hover:font-bold hover:bg-transparent"
          onClick={() => router.back()}
        >
          <ArrowLeft className="" /> Back
        </Button>

        <div className="flex gap-2 items-center">
          <Button
            className="flex sm:hidden gap-2 bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
            variant="ghost"
            size="icon"
            onClick={toggleControl}
          >
            <Settings size={24} />
          </Button>
          <Link href={"/netform/" + record?.id} target="_blank">
            <Button className="flex gap-2 bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold">
              <SquareArrowUpRight className="h-5 w-5" />
              View
            </Button>
          </Link>
          <RWebShare
            data={{
              text: `${formSubheading}, Build your forms in seconds with NetForms`,
              url: `${process.env.NEXT_PUBLIC_BASE_URL}netforms/${record?.id}`,
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

      <div className="flex flex-col sm:flex-row gap-5 relative">
        {/* Mobile Control component */}
        <div className="sm:hidden">
          <Control
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            selectedGradient={selectedGradient}
            setSelectedGradient={setSelectedGradient}
            onAddField={handleAddField}
            isOpen={isControlVisible}
            onClose={toggleControl}
          />
        </div>
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${isControlVisible ? "translate-x-0" : "-translate-x-full"}
            sm:hidden
          `}
        >
          <div className="h-full overflow-y-auto p-5">
            <Control
              selectedTheme={selectedTheme}
              setSelectedTheme={handleThemeChange}
              selectedGradient={selectedGradient}
              setSelectedGradient={handleGradientChange}
              onAddField={handleAddField}
            />
          </div>
        </div>

        {/* Overlay for mobile */}
        {isControlVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={toggleControl}
          ></div>
        )}

        {/* Desktop Control component */}
        <div
          className="hidden sm:block fixed top-20 left-0 w-1/4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 80px)" }}
        >
          <Control
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            selectedGradient={selectedGradient}
            setSelectedGradient={setSelectedGradient}
            onAddField={handleAddField}
          />
        </div>

        <div
          className="w-full border rounded-lg p-5 h-auto flex items-center justify-center"
          style={{
            background: selectedGradient || "white",
            minHeight: "300px",
          }}
        >
          {jsonform ? (
            <FormUi
              formId={Number(params?.formId)}
              jsonForm={jsonform}
              selectedTheme={selectedTheme}
              onFieldUpdate={onFieldUpdate}
              onFormDetailsUpdate={onFormDetailsUpdate}
              onFieldDelete={onFieldDelete}
              onFieldDuplicate={onFieldDuplicate}
              onFieldAdd={onFieldAdd}
              onFormTitleUpdate={onFormTitleUpdate}
              onFormDescriptionUpdate={onFormDescriptionUpdate}
              onFormSubheadingUpdate={onFormSubheadingUpdate}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EdithForm;