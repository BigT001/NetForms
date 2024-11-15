import React, { useState, useEffect } from "react";

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
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const [editValue, setEditValue] = useState("");

    const contentRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const leftColumnRef = React.useRef<HTMLDivElement>(null);

    // Function to generate Excel-style column headers (A...Z, AA...AZ, BA...ZZ)
    const getColumnLabel = (index: number): string => {
        let label = '';
        let num = index;
        
        while (num >= 0) {
            label = String.fromCharCode(65 + (num % 26)) + label;
            num = Math.floor(num / 26) - 1;
        }
        
        return label;
    };

    // Generate extended columns (up to Z)
    const extendedColumns = Array.from({ length: 26 }, (_, i) => i);

    // Generate extended rows (up to 1000)
    const extendedRows = Array.from({ length: 1000 }, (_, i) => i + 1);

    useEffect(() => {
        setLocalResponses(responses);
    }, [responses]);

    useEffect(() => {
        const content = contentRef.current;
        const header = headerRef.current;
        const leftColumn = leftColumnRef.current;

        const handleScroll = () => {
            if (content && header && leftColumn) {
                requestAnimationFrame(() => {
                    if (content.scrollLeft !== header.scrollLeft) {
                        header.scrollLeft = content.scrollLeft;
                    }
                    if (content.scrollTop !== leftColumn.scrollTop) {
                        leftColumn.scrollTop = content.scrollTop;
                    }
                });
            }
        };

        content?.addEventListener("scroll", handleScroll, { passive: true });
        return () => content?.removeEventListener("scroll", handleScroll);
    }, []);

    if (!localResponses || !localResponses.length) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">No Responses Yet</h2>
                    <p className="text-gray-600">Responses will appear here once submitted.</p>
                </div>
            </div>
        );
    }

    const headers = Object.keys(localResponses[0]);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        setEditingCell({ row: rowIndex, col: colIndex });
        setEditValue(localResponses[rowIndex]?.[headers[colIndex]]?.toString() || "");
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

            <div className="flex-1 relative mx-4 border border-gray-200 rounded-lg overflow-hidden">
                {/* Fixed top-left corner */}
                <div className="absolute top-0 left-0 w-14 h-10 bg-[#f8f9fa] border-b border-r border-gray-200 z-50" />

                {/* Column Headers (A, B, C...) */}
                <div ref={headerRef} className="absolute top-0 left-14 right-0 overflow-hidden bg-white z-40">
                    <div className="w-fit">
                        <div className="flex">
                            {extendedColumns.map((index) => (
                                <div
                                    key={index}
                                    className="w-[200px] h-10 flex items-center justify-center border-b border-r border-gray-200 bg-[#f8f9fa]"
                                >
                                    <span className="text-sm font-medium text-gray-600">
                                        {getColumnLabel(index)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Row Numbers */}
                <div ref={leftColumnRef} className="absolute top-10 left-0 bottom-0 w-14 overflow-hidden bg-white z-40">
                    <div>
                        {extendedRows.map((rowNum) => (
                            <div
                                key={rowNum}
                                className="h-10 flex items-center justify-center border-b border-r border-gray-200 bg-[#f8f9fa]"
                            >
                                <span className="text-sm font-medium text-gray-600">
                                    {rowNum}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div ref={contentRef} className="absolute top-10 left-14 right-0 bottom-0 overflow-auto">
                    <div className="w-fit">
                        {/* Headers row */}
                        <div className="flex">
                            {headers.map((header, index) => (
                                <div
                                    key={index}
                                    className="w-[200px] h-10 flex items-center px-4 border-b border-r border-gray-200 bg-gray-50"
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
                                {headers.map((header, colIndex) => {
                                    const response = localResponses[rowNum - 1];
                                    return (
                                        <div
                                            key={`${rowNum}-${colIndex}`}
                                            className="w-[200px] h-10 flex items-center px-4 border-b border-r border-gray-200"
                                            onClick={() => handleCellClick(rowNum - 1, colIndex)}
                                        >
                                            {editingCell?.row === rowNum - 1 && editingCell?.col === colIndex ? (
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
                                                    {response && typeof response[header] === "object"
                                                        ? JSON.stringify(response[header])
                                                        : response?.[header] || ""}
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
