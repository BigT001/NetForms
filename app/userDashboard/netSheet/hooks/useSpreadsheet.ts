import { useState, useCallback, useRef, useEffect } from 'react';
import { Cell, Sheet, Selection, SpreadsheetProps, CellStyle } from '../types';
import { DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT, MIN_COLUMN_WIDTH, MIN_ROW_HEIGHT } from '../constants';
import { evaluateFormula, getColumnIndexFromLabel } from '../utils';

export const useSpreadsheet = ({
  initialRows,
  initialColumns,
  onDataChange,
  defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
  defaultRowHeight = DEFAULT_ROW_HEIGHT,
}: Pick<SpreadsheetProps, 'initialRows' | 'initialColumns' | 'onDataChange' | 'defaultColumnWidth' | 'defaultRowHeight'>) => {
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
        
        if (initialRows !== undefined && initialColumns !== undefined && targetRow < initialRows && targetCol < initialColumns) {
          newData[targetRow][targetCol] = { ...cell };
        }
      });    });
    
    setSheets(sheets.map(sheet => 
      sheet.id === activeSheetId ? { ...sheet, data: newData } : sheet
    ));
    onDataChange?.(newData);
  }, [selection, clipboard, sheets, activeSheetId, initialRows, initialColumns, onDataChange]);

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

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current) {
        const { clientWidth, clientHeight } = gridRef.current;
        const endRow = Math.min(Math.ceil(clientHeight / (defaultRowHeight || 1)), initialRows || 0);
        const endCol = Math.min(Math.ceil(clientWidth / (defaultColumnWidth || 1)), initialColumns || 0);
        setVisibleRange(prev => ({
          ...prev,
          endRow,
          endCol
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [defaultRowHeight, defaultColumnWidth, initialRows, initialColumns]);

  return {
    sheets,
    activeSheetId,
    selection,
    activeCell,
    showChartDialog,
    setShowChartDialog,
    handleCellChange,
    handleCellSelect,
    insertRow,
    insertColumn,
    deleteRow,
    deleteColumn,
    mergeCells,
    handleCopy,
    handlePaste,
    updateCellStyle,
    toggleCellLock,
    addFilter,
    sortColumn,
    addSheet,
    setActiveSheetId,
    rowHeights,
    colWidths,
    visibleRange,
    gridRef,
  };
};