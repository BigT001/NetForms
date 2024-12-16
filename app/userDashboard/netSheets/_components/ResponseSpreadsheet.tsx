import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ResponseSpreadsheetProps {
  responses: any[];
  formTitle: string;
  formSubheading: string;
  formId: string; // Added formId to props
}

const ResponseSpreadsheet = ({
  responses,
  formTitle,
  formSubheading,
  formId, // Added formId to destructured props
}: ResponseSpreadsheetProps) => {
  const [localResponses, setLocalResponses] = useState(responses);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [columnWidths, setColumnWidths] = useLocalStorage<{ [key: number]: number }>(`columnWidths_${formId}`, {});
  const [rowHeights, setRowHeights] = useLocalStorage<{ [key: number]: number }>(`rowHeights_${formId}`, {});
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const columnHeadersRef = useRef<HTMLDivElement>(null);
  const rowNumbersRef = useRef<HTMLDivElement>(null);
  const resizeCache = useRef<{ [key: number]: HTMLElement[] }>({});

  const DEFAULT_COLUMN_WIDTH = 200;
  const DEFAULT_ROW_HEIGHT = 40;
  const MIN_COLUMN_WIDTH = 50;

  const headers = Object.keys(localResponses?.[0] || {});
  const extendedColumns = headers.length > 0 ? headers : Array.from({ length: 26 }, (_, i) => i.toString());
  const extendedRows = Array.from({ length: Math.max(1000, responses.length) }, (_, i) => i + 1);

  // This is for fast column width calculation
  const calculateColumnWidth = useCallback((colIndex: number) => {
    const header = headers[colIndex];
    const elements = document.querySelectorAll(`[data-col="${colIndex}"] .cell-content`);
    let maxWidth = 0;

    elements.forEach(el => {
      maxWidth = Math.max(maxWidth, (el as HTMLElement).scrollWidth);
    });

    return Math.max(maxWidth + 40, MIN_COLUMN_WIDTH);
  }, [headers]);

  const handleColumnResizeStart = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    setIsResizing(true);
    setResizingColumn(colIndex);
    setResizeStartX(e.clientX);
    getCachedElements(colIndex, 'col');
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || resizingColumn === null) return;
   
    const diff = e.clientX - resizeStartX;
    const newWidth = Math.max(
      MIN_COLUMN_WIDTH,
      (columnWidths[resizingColumn] || DEFAULT_COLUMN_WIDTH) + diff
    );
   
    const elements = getCachedElements(resizingColumn, 'col');
    elements.forEach(el => {
      el.style.width = `${newWidth}px`;
    });
   
    setResizeStartX(e.clientX);
    setColumnWidths(prev => ({ ...prev, [resizingColumn]: newWidth }));
  }, [isResizing, resizingColumn, columnWidths, setColumnWidths]);

  const handleColumnResizeDoubleClick = useCallback((e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    const newWidth = calculateColumnWidth(colIndex);
   
    // Instant visual update
    const elements = getCachedElements(colIndex, 'col');
    elements.forEach(el => {
      el.style.width = `${newWidth}px`;
    });
   
    // State update
    setColumnWidths(prev => ({ ...prev, [colIndex]: newWidth }));
  }, [calculateColumnWidth, setColumnWidths]);

  const getCachedElements = (index: number, type: 'col' | 'row') => {
    if (!resizeCache.current[index]) {
      resizeCache.current[index] = Array.from(
        document.querySelectorAll(`[data-${type}="${index}"]`)
      ) as HTMLElement[];
    }
    return resizeCache.current[index];
  };

  const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(
      localResponses[rowIndex]?.[headers[colIndex]]?.toString() || ""
    );
  }, [localResponses, headers]);

  const handleCellBlur = useCallback(() => {
    if (editingCell) {
      const newResponses = [...localResponses];
      if (newResponses[editingCell.row]) {
        newResponses[editingCell.row][headers[editingCell.col]] = editValue;
        setLocalResponses(newResponses);
        localStorage.setItem(`spreadsheetResponses_${formId}`, JSON.stringify(newResponses));
      }
      setEditingCell(null);
    }
  }, [editingCell, editValue, headers, localResponses, formId]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellBlur();
    }
  }, [handleCellBlur]);

  useEffect(() => {
    const savedResponses = localStorage.getItem(`spreadsheetResponses_${formId}`);
    if (savedResponses) {
      setLocalResponses(JSON.parse(savedResponses));
    } else {
      setLocalResponses(responses);
    }
  }, [responses, formId]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        e.preventDefault();
        handleResizeMove(e);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        setResizingColumn(null);
        resizeCache.current = {};
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleResizeMove]);

  useEffect(() => {
    const mainContent = mainContentRef.current;
    const columnHeaders = columnHeadersRef.current;
    const rowNumbers = rowNumbersRef.current;

    if (!mainContent || !columnHeaders || !rowNumbers) return;

    const handleScroll = () => {
      columnHeaders.style.transform = `translateX(-${mainContent.scrollLeft}px)`;
      rowNumbers.style.transform = `translateY(-${mainContent.scrollTop}px)`;
    };

    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold">{formTitle}</h1>
        <p className="text-gray-600">{formSubheading}</p>
      </div>

      <div className="flex-1 relative mx-4 border border-gray-200 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-14 h-10 bg-[#f8f9fa] border-b border-r border-gray-200 z-50" />

        <div className="absolute top-0 left-14 right-0 h-10 overflow-hidden z-40">
          <div ref={columnHeadersRef} className="absolute top-0 left-0 flex">
            {headers.map((header, index) => (
              <div
                key={index}
                data-col={index}
                className="flex-shrink-0 relative bg-[#f8f9fa] border-b border-r border-gray-200"
                style={{ width: columnWidths[index] || DEFAULT_COLUMN_WIDTH }}
              >
                <div className="h-10 flex items-center justify-center px-2">
                  <span className="text-sm font-medium text-gray-600 truncate">
                    {header}
                  </span>
                </div>
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400"
                  onMouseDown={(e) => handleColumnResizeStart(e, index)}
                  onDoubleClick={(e) => handleColumnResizeDoubleClick(e, index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-10 left-0 bottom-0 w-14 overflow-hidden z-40">
          <div ref={rowNumbersRef} className="absolute top-0 left-0 w-full">
            {extendedRows.map((rowNum) => (
              <div
                key={rowNum}
                className="relative w-full bg-[#f8f9fa] border-b border-r border-gray-200"
                style={{ height: DEFAULT_ROW_HEIGHT }}
              >
                <div className="h-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {rowNum}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={mainContentRef} className="absolute top-10 left-14 right-0 bottom-0 overflow-auto">
          <div className="w-fit">
            {localResponses.map((response, rowIndex) => (
              <div
                key={rowIndex}
                className="flex hover:bg-[#f8f9fa]"
                style={{ height: DEFAULT_ROW_HEIGHT }}
              >
                {headers.map((header, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    data-col={colIndex}
                    className="flex-shrink-0 border-b border-r border-gray-200"
                    style={{ width: columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    <div className="h-full px-4 flex items-center">
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
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
                        <span className="cell-content text-sm text-gray-700 truncate">
                          {response[header]?.toString() || ""}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseSpreadsheet;

