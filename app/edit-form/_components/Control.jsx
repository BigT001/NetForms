"use client";

import React, { useState } from "react";
import { themes } from "@/app/_data/Themes";
import GradientBg from "@/app/_data/GradientBg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";

function Control({ selectedTheme, setSelectedTheme, selectedGradient, setSelectedGradient, onAddField, isOpen, onClose }) {
  const [showMore, setShowMore] = useState(false);

  const handleGradientClick = (bg) => {
    if (typeof setSelectedGradient === 'function') {
      setSelectedGradient(bg.gradient);
    } else {
      console.error('setSelectedGradient is not a function');
    }
  };
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
      className={`fixed inset-y-0 left-0 z-[1000] w-64 bg-white shadow-md border transform ${
        isOpen ? "translate-x-0" : "-translate-x-full "
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-full`}
    >
      <div className="p-4 h-full overflow-y-auto">
        <Button
          className="absolute top-2 right-2 sm:hidden"
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X size={24} />
        </Button>

        <div className="p-4 h-full overflow-y-auto">
          <h2 className="mb-4 font-bold">Themes</h2>
          <Select
            value={selectedTheme}
            onValueChange={(value) => {
              setSelectedTheme(value);
              document.documentElement.setAttribute("data-theme", value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
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

          {/* <div>
            <h2 className="mt-8 my-1 font-bold">Background</h2>
            <div className="grid grid-cols-3 gap-4">
              {GradientBg.map(
                (bg, index) =>
                  (showMore || index < 6) && (
                    <div key={index} className="items-center">
                      <div
                        className={`w-full h-[50px] rounded-lg cursor-pointer hover:border-black hover:border-2 ${
                          bg.gradient === selectedGradient ? 'border-2 border-black' : ''
                        }`}
                        style={{ background: bg.gradient || 'white' }}
                        onClick={() => handleGradientClick(bg)}
                      >
                        {bg.name === "None" && (
                          <span className="flex items-center justify-center h-full">
                            None
                          </span>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div> */}

            {/* <div className="flex flex-col items-center mt-4">
              <Button
                variant="ghost"
                className="hover:bg-transparent hover:text-inherit"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show less" : "Show more"}
              </Button>
              {showMore ? (
                <ChevronUp
                  onClick={() => setShowMore(false)}
                  className="cursor-pointer"
                />
              ) : (
                <ChevronDown
                  onClick={() => setShowMore(true)}
                  className="cursor-pointer"
                />
              )}
            </div> */}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 font-bold">Add Field</h2>
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
//  </div>
  );
}

export default Control;
