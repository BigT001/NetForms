"use client";

import React from "react";
import { themes } from "@/app/_data/Themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function Control({ selectedTheme, setSelectedTheme, onAddField, isOpen, onClose }) {
  const addField = (fieldType) => {
    let newField = {
      fieldType: fieldType,
      formLabel: `New ${fieldType} field`,
      placeholderName: `Enter ${fieldType}`,
      required: false,
    };

    switch (fieldType) {
      case 'select':
      case 'radio':
        newField.options = ['Option 1', 'Option 2', 'Option 3'];
        break;
      case 'checkbox':
        newField.options = ['Checkbox 1', 'Checkbox 2', 'Checkbox 3'];
        break;
      case 'date':
        newField.fieldType = 'date';
        break;
      case 'time':
        newField.fieldType = 'time';
        break;
      case 'scale':
        newField.min = 1;
        newField.max = 5;
        newField.step = 1;
        newField.labels = ['Low', 'High'];
        break;
    }

    onAddField(newField);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-[1000] w-64 h-full bg-white shadow-md transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-full md:border-r border-gray-200`}
    >
      <div className="flex flex-col h-full">
        <Button
          className="absolute top-2 right-2 sm:hidden"
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X size={24} />
        </Button>

        <div className="flex-grow overflow-y-auto p-4">
          <h2 className="mb-4 font-bold">Themes</h2>
          <div className="relative">
            <Select
              value={selectedTheme}
              onValueChange={setSelectedTheme}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent
                className="z-[1001] w-[var(--radix-select-trigger-width)] max-h-[300px]"
                position="popper"
                sideOffset={5}
              >
                {Object.entries(themes).map(([themeName, themeColors]) => (
                  <SelectItem key={themeName} value={themeName}>
                    <div className="flex items-center">
                      <div
                        className="h-6 w-6 rounded-full mr-2"
                        style={{ backgroundColor: themeColors.primary }}
                      ></div>
                      <div
                        className="h-6 w-6 rounded-full mr-2"
                        style={{ backgroundColor: themeColors.secondary }}
                      ></div>
                      <div
                        className="h-6 w-6 rounded-full mr-2"
                        style={{ backgroundColor: themeColors.accent }}
                      ></div>
                      <div
                        className="h-6 w-6 rounded-full mr-2"
                        style={{ backgroundColor: themeColors.neutral }}
                      ></div>
                      <span>{themeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 font-bold">Add Field</h2>
            <div className="flex flex-wrap">
              {['text', 'textarea', 'select', 'radio', 'checkbox', 'date', 'time', 'scale'].map((fieldType) => (
                <Button
                  key={fieldType}
                  size="sm"
                  onClick={() => addField(fieldType)}
                  className="mr-2 mb-2 bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
                >
                  {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Control;