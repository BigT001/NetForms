import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldEdit from "./FieldEdit";
import React, { useState } from "react";

function FormUi({
  jsonForm,
  onFieldUpdate,
  onFieldDelete,
  onFormDetailsUpdate,
  onFieldDuplicate,
  selectedTheme,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!jsonForm || !jsonForm.response || jsonForm.response.length === 0) {
    return <div>No form data available</div>;
  }

  const formData = jsonForm.response[0];

  const getFieldValue = (field, key) => {
    return field[key] || field[key.toLowerCase()] || field[key.toUpperCase()];
  };

  const getOptions = (field) => {
    return (
      getFieldValue(field, "options") ||
      getFieldValue(field, "FormControl") ||
      []
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(true);
    const formElement = e.target;
    const formDataEntries = new FormData(formElement);
    const newFormValues = Object.fromEntries(formDataEntries.entries());
    setFormValues(newFormValues);

    const isValid = formData.fields.every(field =>
      !field.required || newFormValues[getFieldValue(field, "FormField")]
    );

    if (isValid) {
      console.log('Form submitted:', newFormValues);
      // You can send this data to an API or perform any other action here
    } else {
      console.log('Form has validation errors');
    }
    setIsSubmitting(false);
  };
  
  const renderField = (field) => {
    const fieldType = getFieldValue(field, "fieldType") || "text";
    const fieldName = getFieldValue(field, "FormField") || getFieldValue(field, "fieldName");
    const options = getOptions(field);
    switch (fieldType.toLowerCase()) {
      case "dropdown":
      case "select":
        return (
          <select
            id={fieldName}
            name={fieldName}
            className="w-full p-2 border rounded bg-transparent"
            required={field.required}
          >
            <option value="">{field.placeholderName}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "time":
        return (
          <input
            type="time"
            id={fieldName}
            name={fieldName}
            placeholder={field.placeholderName}
            className="w-full p-2 border rounded bg-transparent"
            required={field.required}
          />
        );
      case "text":
      case "email":
      case "number":
      case "date":
      case "tel":
        return (
          <input
            type={fieldType.toLowerCase()}
            id={fieldName}
            name={fieldName}
            placeholder={field.placeholderName}
            className="w-full p-2 border rounded bg-transparent"
            required={field.required}
          />
        );
      case "textarea":
        return (
          <textarea
            id={fieldName}
            name={fieldName}
            placeholder={field.placeholderName}
            className="w-full p-2 border rounded bg-transparent"
            required={field.required}
          ></textarea>
        );
      case "radio":
        return (
          <RadioGroup>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${fieldName}-${option}`} />
                <label htmlFor={`${fieldName}-${option}`}>{option}</label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        if (
          fieldName === "agreeTerms" ||
          !Array.isArray(options) ||
          options.length === 0
        ) {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={fieldName}
                name={fieldName}
                required={field.required}
              />
              <label htmlFor={fieldName}>{field.formLabel}</label>
            </div>
          );
        } else {
          return (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`${fieldName}-${index}`} />
                  <label htmlFor={`${fieldName}-${index}`}>{option}</label>
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
              id={fieldName}
              name={fieldName}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full"
              required={field.required}
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

  return (
    <div className="w-full mx-auto p-6 rounded-lg shadow-lg" data-theme={selectedTheme}>
      <h2 className="font-bold text-center text-2xl text-primary mb-4">
        {formData.formTitle}
      </h2>
      <p className="text-center mb-8">{formData.formSubheading}</p>
  
      <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
        {formData.fields.map((field, index) => (
          <div key={index} className="mb-4 flex items-end">
            <div className="flex-grow">
              <label
                htmlFor={getFieldValue(field, "FormField")}
                className="block mb-2 font-medium"
              >
                {field.formLabel}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {isSubmitted && field.required && !formValues[getFieldValue(field, "FormField")] && (
                <span className="text-red-500 text-sm mt-1">{/*This field is required*/}</span>
              )}
            </div>

            <div className="ml-4">
              <FieldEdit
                field={field}
                onUpdate={(updatedField) => onFieldUpdate(updatedField, index)}
                onDelete={() => onFieldDelete(index)}
                onDuplicate={() => onFieldDuplicate(index)}
              />
            </div>
          </div>
        ))}
        <button 
          type="submit" 
          className="btn btn-primary mt-6 px-6 py-2 rounded w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );  
}

export default FormUi;