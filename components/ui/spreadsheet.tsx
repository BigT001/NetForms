"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Plus, Minus, ArrowUpDown, ArrowLeftRight, Merge, Copy, Clipboard, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ChevronDown, Filter, SortAsc, SortDesc, BarChart2, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Select } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface Cell {
  value: string;
  id: string;
  formula?: string;
  style?: CellStyle;
  mergeInfo?: MergeInfo;
  locked?: boolean;
}

interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

interface MergeInfo {
  startRow: number;
  startCol: number;
  rowSpan: number;
  colSpan: number;
  hidden?: boolean;
}

interface Selection {
  start: { row: number; col: number };
  end: { row: number; col: number };
}

interface SpreadsheetProps {
  initialRows?: number;
  initialColumns?: number;
  className?: string;
  onDataChange?: (data: Cell[][]) => void;
  readOnly?: boolean;
  showToolbar?: boolean;
  showFormulaBar?: boolean;
  defaultColumnWidth?: number;
  defaultRowHeight?: number;
  maxColumns?: number;
  maxRows?: number;
}

interface Sheet {
  id: string;
  name: string;
  data: Cell[][];
}

const DEFAULT_COLUMN_WIDTH = 100;
const DEFAULT_ROW_HEIGHT = 25;
const MIN_COLUMN_WIDTH = 40;
const MIN_ROW_HEIGHT = 20;

export const Spreadsheet: React.FC<SpreadsheetProps> = ({
  initialRows = 100,
  initialColumns = 26,
  className,
  onDataChange,
  readOnly = false,
  showToolbar = true,
  showFormulaBar = true,
  defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
  defaultRowHeight = DEFAULT_ROW_HEIGHT,
  maxColumns = 1000,
  maxRows = 1000,
}) => {
  const [sheets, setSheets] = useState<Sheet[]>([
    { id: '1', name: 'Sheet 1', data: initializeData() }
  ]);
  const [activeSheetId, setActiveSheetId] = useState('1');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [clipboard, setClipboard] = useState<Cell[][]>([]);
  const [rowHeights, setRowHeights] = useState<number[]>(Array(initialRows).fill(defaultRowHeight));
  const [colWidths, setColWidths] = useState<number[]>(Array(initialColumns).fill(defaultColumnWidth));
  const [resizing, setResizing] = useState<{ type: 'row' | 'column'; index: number } | null>(null);
  const [draggedCell, setDraggedCell] = useState<{ row: number; col: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 });
  const [visibleRange, setVisibleRange] = useState({
    startRow: 0,
    endRow: 50,
    startCol: 0,
    endCol: 15
  });
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortConfig, setSortConfig] = useState<{ column: number; direction: 'asc' | 'desc' } | null>(null);
  const [showChartDialog, setShowChartDialog] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const editingInputRef = useRef<HTMLInputElement>(null);

  function initializeData(): Cell[][] {
    return Array(initialRows).fill(null).map((_, rowIndex) =>
      Array(initialColumns).fill(null).map((_, colIndex) => ({
        value: '',
        id: `${rowIndex}-${colIndex}`,
        formula: '',
        style: {
          bold: false,
          italic: false,
          underline: false,
          color: 'inherit',
          backgroundColor: 'transparent',
          fontSize: 14,
          fontFamily: 'Arial',
          textAlign: 'left',
          verticalAlign: 'middle'
        },
        locked: false
      }))
    );
  }

  const getColumnLabel = useCallback((index: number): string => {
    let label = '';
    while (index >= 0) {
      label = String.fromCharCode(65 + (index % 26)) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  }, []);

  const calculateVisibleRange = useCallback(() => {
    if (!gridRef.current) return;

    const { scrollTop, scrollLeft, clientHeight, clientWidth } = gridRef.current;
    const startRow = Math.floor(scrollTop / defaultRowHeight);
    const endRow = Math.min(
      Math.ceil((scrollTop + clientHeight) / defaultRowHeight),
      initialRows
    );
    const startCol = Math.floor(scrollLeft / defaultColumnWidth);
    const endCol = Math.min(
      Math.ceil((scrollLeft + clientWidth) / defaultColumnWidth),
      initialColumns
    );

    setVisibleRange({ startRow, endRow, startCol, endCol });
  }, [defaultRowHeight, defaultColumnWidth, initialRows, initialColumns]);

  const handleScroll = useCallback(() => {
    if (!gridRef.current) return;
    const { scrollTop, scrollLeft } = gridRef.current;
    setScrollPosition({ top: scrollTop, left: scrollLeft });
    calculateVisibleRange();
  }, [calculateVisibleRange]);

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const newData = [...activeSheet.data];
    if (value.startsWith('=')) {
      newData[rowIndex][colIndex].formula = value;
      newData[rowIndex][colIndex].value = evaluateFormula(value, newData);
    } else {
      newData[rowIndex][colIndex].value = value;
      newData[rowIndex][colIndex].formula = '';
    }
    
    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    onDataChange?.(newData);
  }, [sheets, activeSheetId, onDataChange]);

  const evaluateFormula = (formula: string, currentData: Cell[][]): string => {
    try {
      const expression = formula.substring(1);
      const evaluatedExpression = expression.replace(
        /([A-Z]+)(\d+)/g,
        (match, col, row) => {
          const colIndex = getColumnIndexFromLabel(col);
          const rowIndex = parseInt(row) - 1;
          return currentData[rowIndex][colIndex].value || '0';
        }
      );
      
      // Add support for basic Excel-like functions
      const withFunctions = evaluatedExpression.replace(
        /(SUM|AVERAGE|MAX|MIN|COUNT|IF)$$(.*?)$$/g,
        (match, func, args) => {
          const values = args.split(',').map((arg: string) => {
            const trimmed = arg.trim();
            if (trimmed.includes(':')) {
              // Handle range of cells
              const [start, end] = trimmed.split(':');
              const startCol = getColumnIndexFromLabel(start.replace(/\d+/, ''));
              const startRow = parseInt(start.replace(/[A-Z]+/, '')) - 1;
              const endCol = getColumnIndexFromLabel(end.replace(/\d+/, ''));
              const endRow = parseInt(end.replace(/[A-Z]+/, '')) - 1;
              
              const rangeValues = [];
              for (let i = startRow; i <= endRow; i++) {
                for (let j = startCol; j <= endCol; j++) {
                  rangeValues.push(parseFloat(currentData[i][j].value) || 0);
                }
              }
              return rangeValues;
            }
            return parseFloat(trimmed) || 0;
          }).flat();

          switch (func) {
            case 'SUM':
              return values.reduce((a: number, b: number) => a + b, 0).toString();
            case 'AVERAGE':
              return (values.reduce((a: number, b: number) => a + b, 0) / values.length).toString();
            case 'MAX':
              return Math.max(...values).toString();
            case 'MIN':
              return Math.min(...values).toString();
            case 'COUNT':
              return values.length.toString();
            case 'IF':
              const [condition, trueValue, falseValue] = args.split(',');
              return eval(condition) ? trueValue : falseValue;
            default:
              return match;
          }
        }
      );
      
      return eval(withFunctions).toString();
    } catch (error) {
      return '#ERROR';
    }
  };

  const getColumnIndexFromLabel = (label: string): number => {
    let index = 0;
    for (let i = 0; i < label.length; i++) {
      index = index * 26 + label.charCodeAt(i) - 64;
    }
    return index - 1;
  };

  const handleCellSelect = useCallback((rowIndex: number, colIndex: number, isShiftKey: boolean) => {
    if (!isShiftKey) {
      setSelection({
        start: { row: rowIndex, col: colIndex },
        end: { row: rowIndex, col: colIndex }
      });
      setActiveCell({ row: rowIndex, col: colIndex });
    } else if (selection) {
      setSelection({
        ...selection,
        end: { row: rowIndex, col: colIndex }
      });
    }
  }, [selection]);

  const handleCopy = useCallback(() => {
    if (!selection) return;
    
    const { start, end } = selection;
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const copiedData = [];
    
    for (let i = Math.min(start.row, end.row); i <= Math.max(start.row, end.row); i++) {
      const row = [];
      for (let j = Math.min(start.col, end.col); j <= Math.max(start.col, end.col); j++) {
        row.push({ ...activeSheet.data[i][j] });
      }
      copiedData.push(row);
    }
    
    setClipboard(copiedData);
  }, [selection, sheets, activeSheetId]);

  const handlePaste = useCallback(() => {
    if (!selection || clipboard.length === 0) return;
    
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const newData = [...activeSheet.data];
    const { start } = selection;
    
    clipboard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const targetRow = start.row + rowIndex;
        const targetCol = start.col + colIndex;
        
        if (targetRow < initialRows && targetCol < initialColumns) {
          newData[targetRow][targetCol] = { ...cell };
        }
      });
    });
    
    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    onDataChange?.(newData);
  }, [selection, clipboard, sheets, activeSheetId, initialRows, initialColumns, onDataChange]);

  const handleResizeStart = useCallback((type: 'row' | 'column', index: number) => {
    setResizing({ type, index });
  }, []);

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!resizing) return;
    
    const { type, index } = resizing;
    const delta = type === 'row' ? e.clientY - e.currentTarget.getBoundingClientRect().top :
                                   e.clientX - e.currentTarget.getBoundingClientRect().left;
    
    if (type === 'row') {
      const newHeights = [...rowHeights];
      newHeights[index] = Math.max(MIN_ROW_HEIGHT, delta);
      setRowHeights(newHeights);
    } else {
      const newWidths = [...colWidths];
      newWidths[index] = Math.max(MIN_COLUMN_WIDTH, delta);
      setColWidths(newWidths);
    }
  }, [resizing, rowHeights, colWidths]);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  const autoFitContent = useCallback((type: 'row' | 'column', index: number) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    if (type === 'column') {
      const maxWidth = Math.max(
        ...activeSheet.data.map(row => {
          const content = row[index].value || row[index].formula;
          const tempElement = document.createElement('span');
          tempElement.style.visibility = 'hidden';
          tempElement.style.whiteSpace = 'nowrap';
          tempElement.style.fontFamily = row[index].style?.fontFamily || 'Arial';
          tempElement.style.fontSize = `${row[index].style?.fontSize || 14}px`;
          tempElement.style.fontWeight = row[index].style?.bold ? 'bold' : 'normal';
          tempElement.style.fontStyle = row[index].style?.italic ? 'italic' : 'normal';
          tempElement.textContent = content ?? '';
          document.body.appendChild(tempElement);
          const width = tempElement.offsetWidth;
          document.body.removeChild(tempElement);
          return width + 20; // Padding
        })
      );
      
      const newWidths = [...colWidths];
      newWidths[index] = Math.max(MIN_COLUMN_WIDTH, maxWidth);
      setColWidths(newWidths);
    }
  }, [sheets, activeSheetId, colWidths]);

  const insertRow = useCallback((index: number) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const newData = [...activeSheet.data];
    const newRow = Array(initialColumns).fill(null).map((_, colIndex) => ({
      value: '',
      id: `${index}-${colIndex}`,
      formula: '',
      style: { ...activeSheet.data[0][0].style },
      locked: false
    }));
    newData.splice(index, 0, newRow);
    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    setRowHeights([...rowHeights.slice(0, index), defaultRowHeight, ...rowHeights.slice(index)]);
    onDataChange?.(newData);
  }, [sheets, activeSheetId, initialColumns, rowHeights, defaultRowHeight, onDataChange]);

  const deleteRow = useCallback((index: number) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const newData = [...activeSheet.data];
    newData.splice(index, 1);
    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    setRowHeights([...rowHeights.slice(0, index), ...rowHeights.slice(index + 1)]);
    onDataChange?.(newData);
  }, [sheets, activeSheetId, rowHeights, onDataChange]);

  const insertColumn = useCallback((index: number) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const newData = activeSheet.data.map(row => {
      const newRow = [...row];
      newRow.splice(index, 0, {
        value: '',
        id: `${row[0].id.split('-')[0]}-${index}`,
        formula: '',
        style: { ...row[0].style },
        locked: false
      });
      return newRow;
    });
    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    setColWidths([...colWidths.slice(0, index), defaultColumnWidth, ...colWidths.slice(index)]);
    onDataChange?.(newData);
  }, [sheets, activeSheetId, colWidths, defaultColumnWidth, onDataChange]);

  const deleteColumn = useCallback((index: number) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const newData = activeSheet.data.map(row => {
      const newRow = [...row];
      newRow.splice(index, 1);
      return newRow;
    });
    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    setColWidths([...colWidths.slice(0, index), ...colWidths.slice(index + 1)]);
    onDataChange?.(newData);
  }, [sheets, activeSheetId, colWidths, onDataChange]);

  const mergeCells = useCallback(() => {
    if (!selection) return;

    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const { start, end } = selection;
    const newData = [...activeSheet.data];
    const mergeInfo = {
      startRow: Math.min(start.row, end.row),
      startCol: Math.min(start.col, end.col),
      rowSpan: Math.abs(end.row - start.row) + 1,
      colSpan: Math.abs(end.col - start.col) + 1
    };

    for (let i = mergeInfo.startRow; i < mergeInfo.startRow + mergeInfo.rowSpan; i++) {
      for (let j = mergeInfo.startCol; j < mergeInfo.startCol + mergeInfo.colSpan; j++) {
        if (i === mergeInfo.startRow && j === mergeInfo.startCol) {
          newData[i][j].mergeInfo = mergeInfo;
        } else {
          newData[i][j].mergeInfo = { ...mergeInfo, hidden: true };
        }
      }
    }

    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    onDataChange?.(newData);
  }, [selection, sheets, activeSheetId, onDataChange]);

  const handleDragStart = useCallback((e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.dataTransfer.setData('text/plain', '');
    setDraggedCell({ row: rowIndex, col: colIndex });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    if (!draggedCell) return;

    const deltaRow = rowIndex - draggedCell.row;
    const deltaCol = colIndex - draggedCell.col;

    if (deltaRow !== 0) {
      const newRowHeights = [...rowHeights];
      newRowHeights[draggedCell.row] = Math.max(MIN_ROW_HEIGHT, rowHeights[draggedCell.row] + deltaRow);
      setRowHeights(newRowHeights);
    }

    if (deltaCol !== 0) {
      const newColWidths = [...colWidths];
      newColWidths[draggedCell.col] = Math.max(MIN_COLUMN_WIDTH, colWidths[draggedCell.col] + deltaCol);
      setColWidths(newColWidths);
    }
  }, [draggedCell, rowHeights, colWidths]);

  const handleDragEnd = useCallback(() => {
    setDraggedCell(null);
  }, []);

  const updateCellStyle = useCallback((style: Partial<CellStyle>) => {
    if (!selection) return;

    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const { start, end } = selection;
    const newData = [...activeSheet.data];

    for (let i = Math.min(start.row, end.row); i <= Math.max(start.row, end.row); i++) {
      for (let j = Math.min(start.col, end.col); j <= Math.max(start.col, end.col); j++) {
        newData[i][j].style = { ...newData[i][j].style, ...style };
      }
    }

    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    onDataChange?.(newData);
  }, [selection, sheets, activeSheetId, onDataChange]);

  const toggleCellLock = useCallback(() => {
    if (!selection) return;

    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const { start, end } = selection;
    const newData = [...activeSheet.data];

    for (let i = Math.min(start.row, end.row); i <= Math.max(start.row, end.row); i++) {
      for (let j = Math.min(start.col, end.col); j <= Math.max(start.col, end.col); j++) {
        newData[i][j].locked = !newData[i][j].locked;
      }
    }

    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    onDataChange?.(newData);
  }, [selection, sheets, activeSheetId, onDataChange]);

  const addFilter = useCallback((column: number) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const uniqueValues = new Set(activeSheet.data.map(row => row[column].value));
    setFilters({ ...filters, [column]: Array.from(uniqueValues)[0] });
  }, [sheets, activeSheetId, filters]);

  const applyFilter = useCallback((column: number, value: string) => {
    setFilters({ ...filters, [column]: value });
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const sortColumn = useCallback((column: number) => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const newDirection = sortConfig?.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, direction: newDirection });

    const newData = [...activeSheet.data].sort((a, b) => {
      if (a[column].value < b[column].value) return newDirection === 'asc' ? -1 : 1;
      if (a[column].value > b[column].value) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    onDataChange?.(newData);
  }, [sheets, activeSheetId, sortConfig, onDataChange]);

  const addSheet = useCallback(() => {
    const newSheetId = (parseInt(sheets[sheets.length - 1].id) + 1).toString();
    setSheets([...sheets, {
      id: newSheetId,
      name: `Sheet ${newSheetId}`,
      data: initializeData()
    }]);
    setActiveSheetId(newSheetId);
  }, [sheets]);

  const renderCell = useCallback((cell: Cell, rowIndex: number, colIndex: number) => {
    if (cell.mergeInfo?.hidden) return null;

    const isSelected = selection && 
      rowIndex >= Math.min(selection.start.row, selection.end.row) &&
      rowIndex <= Math.max(selection.start.row, selection.end.row) &&
      colIndex >= Math.min(selection.start.col, selection.end.col) &&
      colIndex <= Math.max(selection.start.col, selection.end.col);

    const isActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;

    return (
      <td
        key={cell.id}
        className={cn(
          "border border-gray-300 p-0 relative",
          isSelected && "bg-blue-100",
          isActive && "ring-2 ring-blue-500",
          cell.locked && "bg-gray-100"
        )}
        style={{
          width: `${colWidths[colIndex]}px`,
          height: `${rowHeights[rowIndex]}px`,
          backgroundColor: cell.style?.backgroundColor,
          ...(cell.mergeInfo && {
            gridColumn: `span ${cell.mergeInfo.colSpan}`,
            gridRow: `span ${cell.mergeInfo.rowSpan}`
          })
        }}
        onClick={() => handleCellSelect(rowIndex, colIndex, false)}
        onMouseDown={(e) => {
          if (e.shiftKey) {
            handleCellSelect(rowIndex, colIndex, true);
          }
        }}
        draggable
        onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
        onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
        onDragEnd={handleDragEnd}
      >
        <input
          type="text"
          value={isEditing && isActive ? cell.formula || cell.value : cell.value}
          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
          onDoubleClick={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          className={cn(
            "w-full h-full p-2 focus:outline-none",
            cell.style?.textAlign === 'center' && "text-center",
            cell.style?.textAlign === 'right' && "text-right"
          )}
          style={{
            color: cell.style?.color,
            fontFamily: cell.style?.fontFamily,
            fontSize: `${cell.style?.fontSize}px`,
            fontWeight: cell.style?.bold ? 'bold' : 'normal',
            fontStyle: cell.style?.italic ? 'italic' : 'normal',
            textDecoration: cell.style?.underline ? 'underline' : 'none'
          }}
          readOnly={readOnly || cell.locked}
          ref={isActive ? editingInputRef : null}
        />
      </td>
    );
  }, [selection, activeCell, isEditing, colWidths, rowHeights, handleCellSelect, handleCellChange, handleDragStart, handleDragOver, handleDragEnd, readOnly]);

  const renderToolbar = () => (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button onClick={() => insertRow(selection?.start.row || 0)}>
        <Plus className="w-4 h-4 mr-1" />
        Insert Row
      </Button>
      <Button onClick={() => insertColumn(selection?.start.col || 0)}>
        <Plus className="w-4 h-4 mr-1" />
        Insert Column
      </Button>
      <Button onClick={() => deleteRow(selection?.start.row || 0)}>
        <Minus className="w-4 h-4 mr-1" />
        Delete Row
      </Button>
      <Button onClick={() => deleteColumn(selection?.start.col || 0)}>
        <Minus className="w-4 h-4 mr-1" />
        Delete Column
      </Button>
      <Button onClick={mergeCells}>
        <Merge className="w-4 h-4 mr-1" />
        Merge Cells
      </Button>
      <Button onClick={handleCopy}>
        <Copy className="w-4 h-4 mr-1" />
        Copy
      </Button>
      <Button onClick={handlePaste}>
        <Clipboard className="w-4 h-4 mr-1" />
        Paste
      </Button>
      <Button onClick={() => updateCellStyle({ bold: true })}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button onClick={() => updateCellStyle({ italic: true })}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button onClick={() => updateCellStyle({ underline: true })}>
        <Underline className="w-4 h-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <AlignLeft className="w-4 h-4 mr-1" />
            Align
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <Button onClick={() => updateCellStyle({ textAlign: 'left' })}>
            <AlignLeft className="w-4 h-4 mr-2" />
            Left
          </Button>
          <Button onClick={() => updateCellStyle({ textAlign: 'center' })}>
            <AlignCenter className="w-4 h-4 mr-2" />
            Center
          </Button>
          <Button onClick={() => updateCellStyle({ textAlign: 'right' })}>
            <AlignRight className="w-4 h-4 mr-2" />
            Right
          </Button>
        </PopoverContent>
      </Popover>
      <Input
        type="color"
        onChange={(e) => updateCellStyle({ color: e.target.value })}
        className="w-8 h-8 p-0"
      />
      <Input
        type="color"
        onChange={(e) => updateCellStyle({ backgroundColor: e.target.value })}
        className="w-8 h-8 p-0"
      />
      <Select onValueChange={(value) => updateCellStyle({ fontSize: parseInt(value) })}>
  <SelectTrigger>
    <SelectValue placeholder="Font Size" />
  </SelectTrigger>
  <SelectContent>
    {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
      <SelectItem key={size} value={size.toString()}>
        {size}px
      </SelectItem>
    ))}
  </SelectContent>
</Select>

      <Button onClick={toggleCellLock}>
        {selection && sheets.find(sheet => sheet.id === activeSheetId)?.data[selection.start.row][selection.start.col].locked ? (
          <Unlock className="w-4 h-4 mr-1" />
        ) : (
          <Lock className="w-4 h-4 mr-1" />
        )}
        Toggle Lock
      </Button>
      <Button onClick={() => addFilter(selection?.start.col || 0)}>
        <Filter className="w-4 h-4 mr-1" />
        Add Filter
      </Button>
      <Button onClick={() => sortColumn(selection?.start.col || 0)}>
        {sortConfig?.direction === 'asc' ? (
          <SortAsc className="w-4 h-4 mr-1" />
        ) : (
          <SortDesc className="w-4 h-4 mr-1" />
        )}
        Sort
      </Button>
      <Button onClick={() => setShowChartDialog(true)}>
        <BarChart2 className="w-4 h-4 mr-1" />
        Create Chart
      </Button>
    </div>
  );

  useEffect(() => {
    calculateVisibleRange();
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
      return () => gridElement.removeEventListener('scroll', handleScroll);
    }
  }, [calculateVisibleRange, handleScroll]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {showToolbar && renderToolbar()}
      
      {showFormulaBar && (
        <div className="flex items-center gap-2 p-2 border-b">
          <span className="font-bold">fx</span>
          <Input
            value={activeCell ? sheets.find(sheet => sheet.id === activeSheetId)?.data[activeCell.row][activeCell.col].formula || sheets.find(sheet => sheet.id === activeSheetId)?.data[activeCell.row][activeCell.col].value : ''}
            onChange={(e) => activeCell && handleCellChange(activeCell.row, activeCell.col, e.target.value)}
            className="flex-1"
          />
        </div>
      )}
      
      <div className="flex-1 flex">
        <div className="flex-1 overflow-auto">
          <div
            ref={gridRef}
            className="overflow-auto flex-1"
            onScroll={handleScroll}
          >
            <table className="border-collapse table-fixed">
              <colgroup>
                <col style={{ width: '40px' }} />
                {colWidths.map((width, index) => (
                  <col key={index} style={{ width: `${width}px` }} />
                ))}
              </colgroup>
              
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-20 bg-gray-100" />
                  {Array.from({ length: initialColumns }).map((_, index) => (
                    <th
                      key={index}
                      className="sticky top-0 bg-gray-100 border border-gray-300"
                    >
                      {getColumnLabel(index)}
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                        onMouseDown={() => handleResizeStart('column', index)}
                        onDoubleClick={() => autoFitContent('column', index)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {Array.from({ length: initialRows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="sticky left-0 bg-gray-100 border border-gray-300 text-center">
                      {rowIndex + 1}
                      <div
                        className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize"
                        onMouseDown={() => handleResizeStart('row', rowIndex)}
                      />
                    </td>
                    {sheets.find(sheet => sheet.id === activeSheetId)?.data[rowIndex].map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="w-40 border-l p-2">
          <h3 className="font-bold mb-2">Sheets</h3>
          {sheets.map(sheet => (
            <div
              key={sheet.id}
              className={cn(
                "cursor-pointer p-1 rounded",
                activeSheetId === sheet.id && "bg-blue-100"
              )}
              onClick={() => setActiveSheetId(sheet.id)}
            >
              {sheet.name}
            </div>
          ))}
          <Button onClick={addSheet} className="mt-2 w-full">
            <Plus className="w-4 h-4 mr-1" />
            Add Sheet
          </Button>
        </div>
      </div>

      <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Chart</DialogTitle>
            <DialogDescription>
              Select the data range and chart type to create a chart.
            </DialogDescription>
          </DialogHeader>
          {/* Add chart creation form here */}
        </DialogContent>
      </Dialog>
    </div>
  );
};