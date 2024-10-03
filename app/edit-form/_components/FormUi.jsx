import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldEdit from "./FieldEdit";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { db } from "@/configs";
import { formSubmissions } from "@/configs/schema";
import { sql } from 'drizzle-orm';


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

  if (!jsonForm || !jsonForm.response || jsonForm.response.length === 0) {
    return <div>No form data available</div>;
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
        createdBy: 'anonymous',
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
    const fieldName = getFieldValue(field, "FormField") || getFieldValue(field, "fieldName");
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
            {options && options.map((option, index) => (
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
            {options && options.map((option, index) => (
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
              <Checkbox 
                id={fieldName} 
                name={fieldName}
                value="true"
              />
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

  return (
    <div
      className="w-full mx-auto p-6 rounded-lg shadow-lg"
      data-theme={selectedTheme}
    >
      <div className="relative">
        {editable && isEditingTitle ? (
          <Input
            value={formData.formTitle}
            onChange={(e) => onFormTitleUpdate(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            className="font-bold text-center text-2xl mb-2"
            autoFocus
          />
        ) : (
          <h2 className="font-bold text-center text-2xl mb-2">
            {formData.formTitle}
          </h2>
        )}
        {editable && !isEditingTitle && (
          <>
            <Edit
              className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer"
              size={18}
              onClick={() => setIsEditingTitle(true)}
            />
            <Trash2
              className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
              size={18}
              onClick={handleDeleteTitle}
            />
          </>
        )}
      </div>

      <div className="relative">
        {editable && isEditingSubheading ? (
          <Input
            value={formData.formSubheading}
            onChange={(e) => onFormSubheadingUpdate(e.target.value)}
            onBlur={() => setIsEditingSubheading(false)}
            className="text-center mb-8"
            autoFocus
          />
        ) : (
          <p className="text-center mb-8">{formData.formSubheading}</p>
        )}
        {editable && !isEditingSubheading && (
          <>
            <Edit
              className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer"
              size={18}
              onClick={() => setIsEditingSubheading(true)}
            />
            <Trash2
              className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
              size={18}
              onClick={handleDeleteSubheading}
            />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {formData.fields && formData.fields.length > 0 ? (
          formData.fields.map((field, index) => (
            <div key={index} className="mb-4 flex items-end">
              <div className="flex-grow">
                <label
                  htmlFor={getFieldValue(field, "FormField")}
                  className="block mb-2 font-medium"
                >
                  {field.formLabel}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
              </div>

              {editable && (
                <div className="ml-4">
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
          ))
        ) : (
          <p>No fields available for this form.</p>
        )}
        <button
          type="submit"
          className="btn btn-primary mt-6 px-6 py-2 rounded w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default FormUi;
