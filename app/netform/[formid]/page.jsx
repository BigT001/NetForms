"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/configs";
import { jsonForms, formSubmissions } from "@/configs/schema";
import { eq } from "drizzle-orm";
import FormUi from "@/app/edit-form/_components/FormUi";
import { toast } from "react-hot-toast";
import { updateFormThemeAndBackground } from "@/app/userDashboard/_components/actions";
import Link from "next/link";
import { useLocalStorage } from '../../userDashboard/netSheets/hooks/useLocalStorage';


function LiveNetForm({ params }) {
  const [record, setRecord] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [_, __, trackFormVisit] = useLocalStorage('dummy', null);


  useEffect(() => {
    if (params?.formid) {
      // Track the visit
      trackFormVisit(params.formid);
      const formId = params.formid;
      const visitKey = `form_${formId}_visits`;
      const visits = JSON.parse(localStorage.getItem(visitKey) || "[]");

      // Add current visit with timestamp and location
      const newVisit = {
        timestamp: new Date().toISOString(),
        location: window.location.href,
      };
      visits.push(newVisit);

      // Save back to localStorage
      localStorage.setItem(visitKey, JSON.stringify(visits));

      // Continue with existing form data fetch
      getFormData();
    }
  }, [params?.formid]);

  const getFormData = async () => {
    setLoading(true);
    setError(null);
    try {
      const formId = Number(params.formid);
      if (!Number.isInteger(formId) || formId <= 0) {
        throw new Error("Invalid form ID");
      }

      const result = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.id, formId));

      if (result.length === 0) {
        throw new Error("Form not found");
      }

      setRecord(result[0]);
      setJsonForm(JSON.parse(result[0].jsonform));
      setTheme(result[0].theme || "light");
    } catch (err) {
      console.error("Error fetching form data:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    try {
      await updateFormThemeAndBackground(
        Number(params.formid),
        newTheme,
        record.background
      );
      setTheme(newTheme);
      setRecord((prevRecord) => ({ ...prevRecord, theme: newTheme }));
      toast.success("Theme updated successfully");
    } catch (err) {
      console.error("Error updating theme:", err);
      toast.error(`Error updating theme: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div
      className="grid justify-center items-center md:p-5 md:px-10 lg:px-80 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: record?.background
          ? `url(${record.background})`
          : "none",
      }}
    >
      <div className="w-full max-w-4xl">
        {jsonForm && (
          <FormUi
            formId={Number(params.formid)}
            jsonForm={jsonForm}
            onFieldUpdate={() => console.log("Field updated")}
            onFieldDelete={() => console.log("Field deleted")}
            selectedTheme={theme}
            editable={false}
            background={record?.background}
            onThemeChange={handleThemeChange}
          />
        )}
      </div>

      <div className="grid gap-2 text-center justify-center mt-4">
        <span className="text-md text-gray-400 mt-10 mb-2">
          Create your own AI-powered form in seconds click the link below
        </span>

        <Link href="/" className="inline-block">
          <span className="bg-primary px-2 py-1 font-extrabold text-white rounded-l-md">
            Net
          </span>
          <span className="font-extrabold text-secondary px-2 py-1 border-y border-r rounded-r-md">
            Forms
          </span>
        </Link>
      </div>
    </div>
  );
}

export default LiveNetForm;
