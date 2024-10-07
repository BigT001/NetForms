// FormUi Component Documentation

/**
 * FormUi - A dynamic form rendering component
 * 
 * This component renders a customizable form based on the provided JSON data.
 * It supports various field types, inline editing of title and subheading,
 * and responsive design for mobile and desktop views.
 *
 * @param {Object} props
 * @param {Object} props.jsonForm - The form data in JSON format
 * @param {Function} props.onFieldUpdate - Callback for updating a field
 * @param {Function} props.onFieldDelete - Callback for deleting a field
 * @param {Function} props.onFieldDuplicate - Callback for duplicating a field
 * @param {Function} props.onFormTitleUpdate - Callback for updating the form title
 * @param {Function} props.onFormSubheadingUpdate - Callback for updating the form subheading
 * @param {string} props.selectedTheme - The selected theme for the form
 * @param {boolean} props.editable - Whether the form is editable (default: true)
 */


"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldEdit from "./FieldEdit";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/configs";
import { formSubmissions } from "@/configs/schema";
import { sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";



function FormUi({
  jsonForm,
  onFieldUpdate,
  onFieldDelete,
  onFieldDuplicate,
  onFormTitleUpdate,
  onFormSubheadingUpdate,
  selectedTheme,
  editable = true,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubheading, setIsEditingSubheading] = useState(false);
  const [expandedField, setExpandedField] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileTitleActions, setShowMobileTitleActions] = useState(false);
  const [showMobileSubheadingActions, setShowMobileSubheadingActions] =
    useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!jsonForm || !jsonForm.response || jsonForm.response.length === 0) {
    return <div>Loading...😃</div>;
  }

  const formData = jsonForm.response[0];

  if (!formData || !Array.isArray(formData.fields)) {
    return <div>Invalid form data structure</div>;
  }

  const getFieldValue = (field, key) => {
    return (
      field[key] ||
      field[key.toLowerCase()] ||
      field[key.toUpperCase()] ||
      field.name ||
      field.id
    );
  };

  const getOptions = (field) => {
    return (
      getFieldValue(field, "options") ||
      getFieldValue(field, "FormControl") ||
      []
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);

    console.log("Raw FormData:", Array.from(formData.entries()));

    const formValues = Object.fromEntries(formData.entries());
    console.log("Captured form values:", formValues);

    try {
      const submissionData = {
        jsonResponse: JSON.stringify(formValues),
        createdBy: "anonymous",
        createdAt: new Date().toISOString(),
        data: sql`${JSON.stringify(formValues)}::jsonb`,
      };

      console.log("Submission data:", submissionData);

      const result = await db.insert(formSubmissions).values(submissionData);
      console.log("Database insertion result:", result);

      const insertedData = await db.select().from(formSubmissions).limit(1);
      console.log("Inserted data:", insertedData);

      alert("Form submitted successfully!");
      e.target.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const fieldType = getFieldValue(field, "fieldType") || "text";
    const fieldName =
      getFieldValue(field, "FormField") || getFieldValue(field, "fieldName");
    const options = getOptions(field);

    console.log("Rendering field:", { field, fieldName, fieldType, options });

    const commonProps = {
      id: fieldName,
      name: fieldName,
      className: "w-full p-2 border rounded bg-transparent",
    };

    switch (fieldType.toLowerCase()) {
      case "dropdown":
      case "select":
        return (
          <select {...commonProps}>
            {options &&
              options.map((option, index) => (
                <option
                  key={index}
                  value={typeof option === "object" ? option.value : option}
                >
                  {typeof option === "object" ? option.label : option}
                </option>
              ))}
          </select>
        );
      case "time":
        return <input type="time" {...commonProps} />;
      case "text":
      case "email":
      case "number":
      case "date":
      case "tel":
        return (
          <input
            type={fieldType.toLowerCase()}
            {...commonProps}
            placeholder={field.placeholderName}
          />
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            placeholder={field.placeholderName}
          ></textarea>
        );
      case "radio":
        return (
          <RadioGroup name={fieldName}>
            {options &&
              options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={typeof option === "object" ? option.value : option}
                    name={fieldName}
                    id={`${fieldName}-${index}`}
                  />
                  <label htmlFor={`${fieldName}-${index}`}>
                    {typeof option === "object" ? option.label : option}
                  </label>
                </div>
              ))}
          </RadioGroup>
        );
      case "checkbox":
        if (!Array.isArray(options) || options.length === 0) {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox id={fieldName} name={fieldName} value="true" />
              <label htmlFor={fieldName}>{field.formLabel}</label>
            </div>
          );
        } else {
          return (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldName}-${index}`}
                    name={fieldName}
                    value={typeof option === "object" ? option.value : option}
                  />
                  <label htmlFor={`${fieldName}-${index}`}>
                    {typeof option === "object" ? option.label : option}
                  </label>
                </div>
              ))}
            </div>
          );
        }
      case "scale":
        return (
          <div>
            <input
              type="range"
              {...commonProps}
              min={field.min}
              max={field.max}
              step={field.step}
            />
            <div className="flex justify-between mt-2">
              {field.labels.map((label, index) => (
                <span key={index} className="text-sm">
                  {label}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDeleteTitle = () => {
    onFormTitleUpdate("");
  };

  const handleDeleteSubheading = () => {
    onFormSubheadingUpdate("");
  };

  const toggleFieldExpansion = (e, index) => {
    e.preventDefault();
    setExpandedField(expandedField === index ? null : index);
  };

  return (
    <div
      className="w-full mx-auto p-4 md:p-6 rounded-lg shadow-lg"
      data-theme={selectedTheme}
    >
      {/* Title Section */}
      <div className="relative mb-4 text-center">
        {editable && isEditingTitle ? (
          <Input
            value={formData.formTitle}
            onChange={(e) => onFormTitleUpdate(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            className="font-bold text-center text-xl md:text-2xl mb-2 w-full"
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-center">
            <h2 className="font-bold text-xl md:text-2xl mb-2">
              {formData.formTitle}
            </h2>
            {editable && isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden ml-2"
                onClick={() =>
                  setShowMobileTitleActions(!showMobileTitleActions)
                }
              >
                {showMobileTitleActions ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Button>
            )}
          </div>
        )}
        {editable && !isEditingTitle && (
          <>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingTitle(true)}
              >
                <Edit size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDeleteTitle}>
                <Trash2 size={18} />
              </Button>
            </div>
            {showMobileTitleActions && isMobile && (
              <div className="mt-2 flex justify-end space-x-2 md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDeleteTitle}>
                  <Trash2 size={18} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Subheading Section */}
      <div className="relative mb-8 text-center">
        {editable && isEditingSubheading ? (
          <Input
            value={formData.formSubheading}
            onChange={(e) => onFormSubheadingUpdate(e.target.value)}
            onBlur={() => setIsEditingSubheading(false)}
            className="text-center w-full"
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-center">
            <p>{formData.formSubheading}</p>
            {editable && isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden ml-2"
                onClick={() =>
                  setShowMobileSubheadingActions(!showMobileSubheadingActions)
                }
              >
                {showMobileSubheadingActions ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Button>
            )}
          </div>
        )}
        {editable && !isEditingSubheading && (
          <>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingSubheading(true)}
              >
                <Edit size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteSubheading}
              >
                <Trash2 size={18} />
              </Button>
            </div>
            {showMobileSubheadingActions && isMobile && (
              <div className="mt-2 flex justify-end space-x-2 md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingSubheading(true)}
                >
                  <Edit size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteSubheading}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {formData.fields && formData.fields.length > 0 ? (
          formData.fields.map((field, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={getFieldValue(field, "FormField")}
                  className="font-medium"
                >
                  {field.formLabel}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {isMobile && editable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => toggleFieldExpansion(e, index)}
                    type="button"
                  >
                    {expandedField === index ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </Button>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="flex-grow mb-2 md:mb-0 md:mr-4">
                  {renderField(field)}
                </div>
                {editable && (!isMobile || expandedField === index) && (
                  <div className="flex justify-end space-x-2">
                    <FieldEdit
                      field={field}
                      onUpdate={(updatedField) =>
                        onFieldUpdate(updatedField, index)
                      }
                      onDelete={() => onFieldDelete(index)}
                      onDuplicate={() => onFieldDuplicate(index)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No fields available for this form.</p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default FormUi;
