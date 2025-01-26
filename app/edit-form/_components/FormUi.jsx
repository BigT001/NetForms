"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/configs";
import { formSubmissions, jsonForms } from "@/configs/schema";
import { sql, eq } from "drizzle-orm";
import FieldEdit from "./FieldEdit";
import { toast } from "sonner"


function FormUi({
  jsonForm,
  formId,
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
  const [validFormId, setValidFormId] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [showMobileTitleActions, setShowMobileTitleActions] = useState(false);
  const [showMobileSubheadingActions, setShowMobileSubheadingActions] = useState(false);

  useEffect(() => {
    const numericFormId = Number(formId);
    if (!Number.isInteger(numericFormId) || numericFormId <= 0) {
      console.warn(`Invalid form ID: ${formId}. Using default ID 1.`);
      setValidFormId(1);
    } else {
      setValidFormId(numericFormId);
    }

    if (formId && typeof formId !== "number") {
      console.warn("FormUi: formId should be a number");
    }
  }, [formId]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      updateThemeInDatabase(selectedTheme);
    }
  }, [selectedTheme]);

  const updateThemeInDatabase = async (theme) => {
    try {
      await db
        .update(jsonForms)
        .set({ theme: theme })
        .where(eq(jsonForms.id, validFormId));
      console.log("Theme updated in database");
    } catch (error) {
      console.error("Error updating theme in database:", error);
      toast.error("Failed to update theme in database")
    }
  };
  
  if (!jsonForm || !jsonForm.response || jsonForm.response.length === 0) {
    return <div>Loading...😃</div>;
  }

  const formData = jsonForm.response[0];

  if (!formData || !Array.isArray(formData.fields)) {
    return <div>Invalid form data structure</div>;
  }

  
  useEffect(() => {
    const recordVisit = async () => {
      try {
        const visitData = {
          formId: validFormId,
          isVisit: true,
          jsonResponse: JSON.stringify({}),
          createdAt: new Date().toISOString(),
          createdBy: 'anonymous',
          data: null // Remove the SQL template literal
        };
  
        await db.insert(formSubmissions).values(visitData);
      } catch (error) {
        console.error("Error recording visit:", error);
      }
    };
  
    // Record visit only on initial render
    if (validFormId) {
      recordVisit();
    }
  }, []); // Empty dependency array for single execution
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("handleSubmit - validFormId:", validFormId);
      if (validFormId === null || validFormId <= 0) {
        throw new Error("Invalid form ID");
      }
  
      const currentDate = new Date().toISOString();
      const submissionData = {
        formId: validFormId,
        isVisit: false, // Explicitly mark as not a visit
        jsonResponse: JSON.stringify(formValues),
        createdBy: 'anonymous',
        createdAt: currentDate,
        data: null // Remove the SQL template literal
      };
      console.log("Submitting form data:", submissionData);
  
      const query = db.insert(formSubmissions).values(submissionData).toSQL();
      console.log("SQL Query:", query.sql);
      console.log("SQL Parameters:", query.params);
  
      const result = await db.insert(formSubmissions).values(submissionData);
      console.log("Form submission result:", result);
      
      toast("Form submitted successfully!", {
        icon: "✨",
        style: {
          minWidth: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        },
      });
      
      setFormValues({});
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error submitting form: ${error.message}`, {
        icon: "❌",
        style: {
          minWidth: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

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

  const getUniqueFieldId = (field) => {
    return (
      field.fieldName ||
      field.FormField ||
      field.name ||
      field.id ||
      field.formLabel.replace(/\s+/g, "_").toLowerCase()
    );
  };

  const handleInputChange = (fieldId, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
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

  const renderField = (field, index) => {
    const fieldType = getFieldValue(field, "fieldType") || "text";
    const fieldId = getUniqueFieldId(field, index);
    const options = getOptions(field);

    const commonProps = {
      id: fieldId,
      name: fieldId,
      className: "w-full p-2 border rounded bg-transparent",
      value: formValues[fieldId] || "",
      onChange: (e) => handleInputChange(fieldId, e.target.value),
    };

    switch (fieldType.toLowerCase()) {
      case "dropdown":
      case "select":
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {options.map((option, optionIndex) => (
              <option
                key={optionIndex}
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
          <RadioGroup
            name={fieldId}
            value={formValues[fieldId] || ""}
            onValueChange={(value) => handleInputChange(fieldId, value)}
          >
            {options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={typeof option === "object" ? option.value : option}
                  id={`${fieldId}-${optionIndex}`}
                />
                <label htmlFor={`${fieldId}-${optionIndex}`}>
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
              <Checkbox
                id={fieldId}
                name={fieldId}
                checked={formValues[fieldId] || false}
                onCheckedChange={(checked) =>
                  handleInputChange(fieldId, checked)
                }
              />
              <label htmlFor={fieldId}>{field.formLabel}</label>
            </div>
          );
        } else {
          return (
            <div className="space-y-2">
              {options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldId}-${optionIndex}`}
                    name={fieldId}
                    value={typeof option === "object" ? option.value : option}
                    checked={(formValues[fieldId] || []).includes(
                      typeof option === "object" ? option.value : option
                    )}
                    onCheckedChange={(checked) => {
                      const value =
                        typeof option === "object" ? option.value : option;
                      handleInputChange(
                        fieldId,
                        checked
                          ? [...(formValues[fieldId] || []), value]
                          : (formValues[fieldId] || []).filter(
                              (v) => v !== value
                            )
                      );
                    }}
                  />
                  <label htmlFor={`${fieldId}-${optionIndex}`}>
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
              {field.labels.map((label, labelIndex) => (
                <span key={labelIndex} className="text-sm">
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

  return (
    <div className="w-full mx-auto">
      <div
        className="p-4 md:p-6 rounded-lg shadow-lg"
        data-theme={selectedTheme}
      >
      {/* Title Section */}
      <div className="relative text-center">
        {editable && isEditingTitle ? (
          <Input
            value={formData.formTitle}
            onChange={(e) => onFormTitleUpdate(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            className="font-bold text-center text-xl md:text-2xl  w-full"
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
                  htmlFor={getUniqueFieldId(field, index)}
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
                  {renderField(field, index)}
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
        <Button 
          type="submit" 
          className="px-12 py-2 mx-auto block" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
    </div>
  );
}

export default FormUi;