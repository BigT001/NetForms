import React, { useState, useEffect, useRef } from "react";

interface ResponseSpreadsheetProps {
  responses: any[];
  formTitle: string;
  formSubheading: string;
}

const ResponseSpreadsheet = ({
  responses,
  formTitle,
  formSubheading,
}: ResponseSpreadsheetProps) => {
  const [localResponses, setLocalResponses] = useState(responses);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  const mainContentRef = useRef<HTMLDivElement>(null);
  const columnHeadersRef = useRef<HTMLDivElement>(null);
  const rowNumbersRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getColumnLabel = (index: number): string => {
    let label = "";
    let num = index;
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
    }
    return label;
  };

  const extendedColumns = Array.from({ length: 26 }, (_, i) => i);
  const extendedRows = Array.from({ length: 1000 }, (_, i) => i + 1);

  useEffect(() => {
    setLocalResponses(responses);
  }, [responses]);

  useEffect(() => {
    const mainContent = mainContentRef.current;
    const columnHeaders = columnHeadersRef.current;
    const rowNumbers = rowNumbersRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!mainContent || !columnHeaders || !rowNumbers || !scrollContainer)
      return;

    const handleScroll = () => {
      // Sync horizontal scroll
      columnHeaders.style.transform = `translateX(-${mainContent.scrollLeft}px)`;

      // Sync vertical scroll
      rowNumbers.style.transform = `translateY(-${mainContent.scrollTop}px)`;
    };

    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, []);

  const headers = Object.keys(localResponses?.[0] || {});

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(
      localResponses[rowIndex]?.[headers[colIndex]]?.toString() || ""
    );
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const newResponses = [...localResponses];
      if (newResponses[editingCell.row]) {
        newResponses[editingCell.row][headers[editingCell.col]] = editValue;
        setLocalResponses(newResponses);
      }
      setEditingCell(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellBlur();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold">{formTitle}</h1>
        <p className="text-gray-600">{formSubheading}</p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 relative mx-4 border border-gray-200 rounded-lg overflow-hidden"
      >
        {/* Fixed top-left corner */}
        <div className="absolute top-0 left-0 w-14 h-10 bg-[#f8f9fa] border-b border-r border-gray-200 z-50" />

        {/* Column Headers */}
        <div className="absolute top-0 left-14 right-0 h-10 overflow-hidden z-40">
          <div ref={columnHeadersRef} className="absolute top-0 left-0 flex">
            {extendedColumns.map((index) => (
              <div
                key={index}
                className="w-[200px] h-10 flex items-center justify-center 
                                    border-b border-r border-gray-200 bg-[#f8f9fa] 
                                    flex-shrink-0"
              >
                <span className="text-sm font-medium text-gray-600">
                  {getColumnLabel(index)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row Numbers */}
        {/* Row Numbers */}
        <div className="absolute top-10 left-0 bottom-0 w-14 overflow-hidden z-40">
          <div ref={rowNumbersRef} className="absolute top-0 left-0 w-full">
            {extendedRows.map((rowNum) => (
              <div
                key={rowNum}
                className="w-full h-10 flex items-center justify-center border-b border-r border-gray-200 bg-[#f8f9fa]"
              >
                <span className="text-sm font-medium text-gray-600">
                  {rowNum}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div
          ref={mainContentRef}
          className="absolute top-10 left-14 right-0 bottom-0 overflow-auto"
        >
          <div className="w-fit">
            {/* Headers row */}
            <div className="flex">
              {headers.map((header, index) => (
                <div
                  key={index}
                  className="w-[200px] h-10 flex items-center px-4 border-b border-r border-gray-200 bg-gray-50 flex-shrink-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {header}
                  </span>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {extendedRows.map((rowNum) => (
              <div key={rowNum} className="flex hover:bg-[#f8f9fa]">
                {extendedColumns.map((colIndex) => {
                  const header = headers[colIndex];
                  const response = localResponses[rowNum - 1];
                  return (
                    <div
                      key={`${rowNum}-${colIndex}`}
                      className="w-[200px] min-w-[200px] h-10 flex items-center px-4 border-b border-r border-gray-200 flex-shrink-0"
                      onClick={() => handleCellClick(rowNum - 1, colIndex)}
                    >
                      {editingCell?.row === rowNum - 1 &&
                      editingCell?.col === colIndex ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyPress={handleKeyPress}
                          className="w-full h-9 px-2 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm text-gray-700 truncate">
                          {response && header
                            ? typeof response[header] === "object"
                              ? JSON.stringify(response[header])
                              : response[header] || ""
                            : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseSpreadsheet;
