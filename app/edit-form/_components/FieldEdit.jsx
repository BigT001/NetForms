import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Copy } from "lucide-react";
import React, { useState, useEffect } from "react";

function FieldEdit({ field, onUpdate, onDelete, onDuplicate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedField, setEditedField] = useState(field);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setEditedField(field);
  }, [field]);

  const handleInputChange = (key, value) => {
    setEditedField((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionChange = (index, value) => {
    setEditedField((prev) => {
      const newOptions = [...(prev.options || [])];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const handleAddOption = () => {
    setEditedField((prev) => ({
      ...prev,
      options: [...(prev.options || []), "New Option"],
    }));
  };

  const handleDeleteOption = (index) => {
    setEditedField((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdate(editedField);
    setIsEditing(false);
  };

  const handleOutsideClick = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      setIsEditing(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleDeleteConfirm = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    onDelete();
    setIsDeleteConfirmOpen(false);
  };
  
  

  return (
    <div className="flex">
      {isEditing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold text-center mb-4">Edit form field</h2>
            <div className="mb-6">
              <label className="text-sm">Label Name</label>
              <Input
                type="text"
                value={editedField.formLabel || ""}
                onChange={(e) => handleInputChange("formLabel", e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="text-sm">Placeholder Name</label>
              <Input
                type="text"
                value={editedField.placeholderName || ""}
                onChange={(e) =>
                  handleInputChange("placeholderName", e.target.value)
                }
              />
            </div>
            {(editedField.fieldType === "select" ||
              editedField.fieldType === "radio" ||
              editedField.fieldType === "checkbox") && (
              <div className="mb-6">
                <label className="text-sm">Options</label>
                {(editedField.options || []).map((option, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="mr-2"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleDeleteOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  onClick={handleAddOption}
                  className="flex mt-4 items-center justify-center mx-auto bg-gray-200 hover:bg-gray-300 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}
            <div className="flex justify-center">
              <Button
                size="sm"
                className="mt-4 bg-blue-800 hover:bg-blue-900"
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button
                size="sm"
                className="mt-4 ml-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      <Button
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="ml-2 bg-gray-200 hover:bg-gray-300 text-black"
      >
         <Edit className="text-black h-5 w-5" />
      </Button>
      <Button
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDuplicate();
        }}
        className="ml-2 bg-gray-200 hover:bg-gray-300 text-black"
      >
        <Copy className="text-black h-5 w-5" />
      </Button>
      <Button
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDeleteConfirmOpen(true);
        }}
        className="ml-2 bg-gray-200 hover:bg-gray-300 text-black"
      >
        <Trash2 className="h-5 w-5 text-primary" />
      </Button>
      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white p-6 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-center mb-2">Delete Field</h3>
            <p className="text-sm mb-4">
              Are you sure you want to delete this field?
            </p>
            <div className="flex justify-center gap-3">
              <Button
                size="sm"
                className="bg-gray-200 hover:bg-gray-300 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteConfirmOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConfirm();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FieldEdit;
