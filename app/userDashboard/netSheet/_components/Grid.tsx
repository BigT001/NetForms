import React, { useRef, useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sheet, Selection, Cell } from '../types';
import { getColumnLabel } from '../columnUtils';
import { DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT } from '../constants';

interface GridProps {
  sheets: Sheet[];
  activeSheetId: string;
  selection: Selection | null;
  activeCell: { row: number; col: number } | null;
  readOnly: boolean;
  onCellSelect: (row: number, col: number, isShiftKey: boolean) => void;
  onCellChange: (row: number, col: number, value: string) => void;
}

const TOTAL_COLUMNS = 100; // Increased columns to support AA, AB, etc.
const TOTAL_ROWS = 1000000;

const Grid: React.FC<GridProps> = ({
  sheets,
  activeSheetId,
  selection,
  activeCell,
  readOnly,
  onCellSelect,
  onCellChange,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [visibleRange, setVisibleRange] = useState({ startRow: 0, endRow: 0, startCol: 0, endCol: 0 });

  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);

  const handleScroll = useCallback(() => {
    if (gridRef.current) {
      const { scrollTop, scrollLeft, clientHeight, clientWidth } = gridRef.current;
      const startRow = Math.floor(scrollTop / DEFAULT_ROW_HEIGHT);
      const startCol = Math.floor(scrollLeft / DEFAULT_COLUMN_WIDTH);
      const endRow = Math.min(startRow + Math.ceil(clientHeight / DEFAULT_ROW_HEIGHT), TOTAL_ROWS);
      const endCol = Math.min(startCol + Math.ceil(clientWidth / DEFAULT_COLUMN_WIDTH), TOTAL_COLUMNS);
      setVisibleRange({ startRow, endRow, startCol, endCol });
    }
  }, []);

  useEffect(() => {
    handleScroll();
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
      return () => gridElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleCellClick = useCallback((row: number, col: number, event: React.MouseEvent) => {
    onCellSelect(row, col, event.shiftKey);
    if (!readOnly && event.detail === 2) {
      setEditingCell({ row, col });
      setEditValue(activeSheet?.data[row]?.[col]?.value || '');
    }
  }, [onCellSelect, readOnly, activeSheet]);

  const handleCellKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (editingCell) {
        onCellChange(editingCell.row, editingCell.col, editValue);
        setEditingCell(null);
      } else if (activeCell) {
        setEditingCell(activeCell);
        setEditValue(activeSheet?.data[activeCell.row]?.[activeCell.col]?.value || '');
      }
    } else if (event.key === 'Escape') {
      setEditingCell(null);
    }
  }, [editingCell, activeCell, editValue, onCellChange, activeSheet]);

  const renderCell = useCallback((row: number, col: number) => {
    if (!activeSheet) return null;
    const cell = activeSheet.data[row]?.[col] || { value: '', style: {} };
    const isSelected = selection && row >= selection.start.row && row <= selection.end.row &&
                      col >= selection.start.col && col <= selection.end.col;
    const isActive = activeCell && activeCell.row === row && activeCell.col === col;
    const isEditing = editingCell && editingCell.row === row && editingCell.col === col;

    return (
      <div
        key={`${row}-${col}`}
        className={cn(
          "absolute border-r border-b border-gray-200",
          isSelected && "bg-blue-100",
          isActive && "ring-2 ring-blue-500",
          cell.style?.backgroundColor && `bg-${cell.style.backgroundColor}-100`
        )}
        style={{
          left: (col + 1) * DEFAULT_COLUMN_WIDTH,
          top: (row + 1) * DEFAULT_ROW_HEIGHT,
          width: DEFAULT_COLUMN_WIDTH,
          height: DEFAULT_ROW_HEIGHT,
        }}
        onClick={(e) => handleCellClick(row, col, e)}
      >
        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleCellKeyDown}
            onBlur={() => {
              onCellChange(row, col, editValue);
              setEditingCell(null);
            }}
            className="w-full h-full p-1 outline-none"
          />
        ) : (
          <div className="w-full h-full p-1 overflow-hidden">
            {cell.value}
          </div>
        )}
      </div>
    );
  }, [activeSheet, selection, activeCell, editingCell, editValue, handleCellClick, handleCellKeyDown, onCellChange]);

  const renderColumnHeaders = useCallback(() => {
    return (
      <>
        <div
          className="absolute border-r-2 border-b-2 border-gray-300 bg-gray-100"
          style={{
            left: 0,
            top: 0,
            width: DEFAULT_COLUMN_WIDTH,
            height: DEFAULT_ROW_HEIGHT,
            zIndex: 3,
          }}
        />
        {Array.from({ length: TOTAL_COLUMNS }, (_, col) => (
          <div
            key={`col-${col}`}
            className="absolute border-r-2 border-b-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-semibold"
            style={{
              left: (col + 1) * DEFAULT_COLUMN_WIDTH,
              top: 0,
              width: DEFAULT_COLUMN_WIDTH,
              height: DEFAULT_ROW_HEIGHT,
              zIndex: 2,
            }}
          >
            {getColumnLabel(col)}
          </div>
        ))}
      </>
    );
  }, []);

  const renderRowHeaders = useCallback(() => {
    return (
      <>
        {Array.from({ length: visibleRange.endRow - visibleRange.startRow }, (_, i) => i + visibleRange.startRow).map((row) => (
          <div
            key={`row-${row}`}
            className="absolute border-r-2 border-b-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-semibold"
            style={{
              left: 0,
              top: (row + 1) * DEFAULT_ROW_HEIGHT,
              width: DEFAULT_COLUMN_WIDTH,
              height: DEFAULT_ROW_HEIGHT,
              zIndex: 2,
            }}
          >
            {row + 1}
          </div>
        ))}
      </>
    );
  }, [visibleRange]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div
        ref={gridRef}
        className="absolute inset-0 overflow-auto"
        onScroll={handleScroll}
        tabIndex={0}
        onKeyDown={handleCellKeyDown}
      >
        <div
          className="absolute"
          style={{
            width: (TOTAL_COLUMNS + 1) * DEFAULT_COLUMN_WIDTH,
            height: (TOTAL_ROWS + 1) * DEFAULT_ROW_HEIGHT,
          }}
        >
          {renderColumnHeaders()}
          {renderRowHeaders()}
          {Array.from({ length: visibleRange.endRow - visibleRange.startRow }, (_, i) => i + visibleRange.startRow).map((row) =>
            Array.from({ length: visibleRange.endCol - visibleRange.startCol }, (_, j) => j + visibleRange.startCol).map((col) =>
              renderCell(row, col)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Grid;
