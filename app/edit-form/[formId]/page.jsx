"use client";

import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import FormUi from "../_components/FormUi";
import debounce from 'lodash/debounce';
import { toast } from "sonner";
import Control from "../_components/Control"; 

function EdithForm({ params }) {
  const { user } = useUser();
  const [jsonform, setJsonForm] = useState(null);
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedGradient, setSelectedGradient] = useState('');

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
    debounce(async (updatedJsonForm) => {
      if (!record) return;
      try {
        await db.update(jsonForms)
          .set({ jsonform: JSON.stringify(updatedJsonForm) })
          .where(
            and(
              eq(jsonForms.id, record.id),
              eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
            )
          );
        toast.success("Form updated in database");
      } catch (error) {
        console.error("Error in database operation:", error);
        toast.error("Failed to update form in database");
      }
    }, 1000),
    [record, user]
  );

  const onFieldUpdate = (updatedField, index) => {
    setJsonForm(prevForm => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      updatedForm.response[0].fields[index] = updatedField;
      debouncedUpdateDb(updatedForm);
      toast.success("Field updated successfully");
      return updatedForm;
    });
  };

  const onFormDetailsUpdate = (key, value) => {
    setJsonForm(prevForm => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      updatedForm.response[0][key] = value;
      debouncedUpdateDb(updatedForm);
      toast.success("Form details updated successfully");
      return updatedForm;
    });
  };

  const onFieldDelete = async (index) => {
    setJsonForm(prevForm => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      updatedForm.response[0].fields.splice(index, 1);
      debouncedUpdateDb(updatedForm);
      toast.success("Field deleted successfully");
      return updatedForm;
    });
  };

  const onFieldDuplicate = (index) => {
    setJsonForm(prevForm => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      const fieldToDuplicate = updatedForm.response[0].fields[index];
      const duplicatedField = { ...fieldToDuplicate, id: Date.now() };
      updatedForm.response[0].fields.splice(index + 1, 0, duplicatedField);
      debouncedUpdateDb(updatedForm);
      toast.success("Field duplicated successfully");
      return updatedForm;
    });
  };

  useEffect(() => {
    console.log("Selected gradient changed:", selectedGradient);
  }, [selectedGradient]);
  const handleGradientChange = useCallback((gradient) => {
    console.log("Gradient change called with:", gradient);
    setSelectedGradient(gradient);
  }, []);

  return (
    <div className="p-10">
      <h2
        className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
        onClick={() => router.back()}
      >
        <ArrowLeft /> Back
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border rounded-lg shadow-md">
          <Control 
            setSelectedTheme={setSelectedTheme} 
            selectedTheme={selectedTheme}
            setSelectedGradient={handleGradientChange}
          />
        </div>

        <div 
          className="md:col-span-2 border rounded-lg p-5 h-auto flex items-center justify-center"
          style={{
            background: selectedGradient || 'white',
            minHeight: '300px', // Add this to ensure the div has a visible height
          }}
        >
          {jsonform ? (
            <FormUi
              jsonForm={jsonform}
              selectedTheme={selectedTheme}
              onFieldUpdate={onFieldUpdate}
              onFormDetailsUpdate={onFormDetailsUpdate}
              onFieldDelete={onFieldDelete}
              onFieldDuplicate={onFieldDuplicate}
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