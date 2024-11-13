import React from 'react';
import { Input } from '@/components/ui/input';
import { Sheet } from '../types';

interface FormulaBarProps {
  activeCell: { row: number; col: number } | null;
  sheets: Sheet[];
  activeSheetId: string;
  onCellChange: (row: number, col: number, value: string) => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  activeCell,
  sheets,
  activeSheetId,
  onCellChange,
}) => {
  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
  const cellValue = activeCell && activeSheet?.data?.[activeCell.row]?.[activeCell.col]
    ? activeSheet.data[activeCell.row][activeCell.col].formula || activeSheet.data[activeCell.row][activeCell.col].value
    : '';

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <span className="font-bold">fx</span>
      <Input
        value={cellValue}
        onChange={(e) => activeCell && onCellChange(activeCell.row, activeCell.col, e.target.value)}
        className="flex-1"
      />
    </div>
  );
};

export default FormulaBar;
