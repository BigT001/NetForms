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
import { ChevronDown, ChevronUp } from "lucide-react";

function Control({ setSelectedTheme, setSelectedGradient }) {
  const [showMore, setShowMore] = useState(false);

  const handleGradientClick = (bg) => {
    console.log("Gradient clicked:", bg.gradient);
    if (typeof setSelectedGradient === 'function') {
      setSelectedGradient(bg.gradient);
    } else {
      console.error('setSelectedGradient is not a function');
    }
  };

  return (
    <div>
      {/* Theme selection control */}
      <h2 className="mb-4 font-bold">Themes</h2>
      <Select
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

      {/* background selection control */}
      <div>
        <h2 className="mt-8 my-1 font-bold">Background</h2>
        <div className="grid grid-cols-3 gap-4">
          {GradientBg.map(
            (bg, index) =>
              (showMore || index < 6) && (
                <div key={index} className="items-center">
                  <div
                    className="w-full h-[50px] rounded-lg cursor-pointer hover:border-black hover:border-2"
                    style={{ background: bg.gradient || 'white' }}
                    onClick={() => handleGradientClick(bg)}
                  >
                    {bg.name === "None" && (
                      <span className="flex items-center justify-center h-full">
                        None
                      </span>
                    )}
                  </div>
                  {/* <span className="flex items-center justify-center text-xs mt-1">{bg.name}</span> */}
                </div>
              )
          )}
        </div>


        <div className="flex flex-col items-center mt-4">
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
        </div>
      </div>
    </div>
  );
}

export default Control;