import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Merge, Copy, Clipboard, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ChevronDown, Filter, SortAsc, SortDesc, BarChart2, Lock, Unlock } from 'lucide-react';
import { Selection, Sheet, CellStyle } from '../types';

interface ToolbarProps {
  selection: Selection | null;
  sheets: Sheet[];
  activeSheetId: string;
  onInsertRow: (index: number) => void;
  onInsertColumn: (index: number) => void;
  onDeleteRow: (index: number) => void;
  onDeleteColumn: (index: number) => void;
  onMergeCells: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUpdateCellStyle: (style: Partial<CellStyle>) => void;
  onToggleCellLock: () => void;
  onAddFilter: (column: number) => void;
  onSortColumn: (column: number, direction: 'asc' | 'desc') => void;
  onCreateChart: () => void;
  onResizeColumn?: (columnIndex: number, width: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selection,
  sheets,
  activeSheetId,
  onInsertRow,
  onInsertColumn,
  onDeleteRow,
  onDeleteColumn,
  onMergeCells,
  onCopy,
  onPaste,
  onUpdateCellStyle,
  onToggleCellLock,
  onAddFilter,
  onSortColumn,
  onCreateChart,
  onResizeColumn,
}) => {
  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
  const isSelectionActive = selection !== null;

  const handleInsertRow = () => {
    if (selection) {
      onInsertRow(selection.start.row);
    }
  };

  const handleInsertColumn = () => {
    if (selection) {
      onInsertColumn(selection.start.col);
    }
  };

  const handleDeleteRow = () => {
    if (selection) {
      onDeleteRow(selection.start.row);
    }
  };

  const handleDeleteColumn = () => {
    if (selection) {
      onDeleteColumn(selection.start.col);
    }
  };

  const handleUpdateFontStyle = (style: 'bold' | 'italic' | 'underline') => {
    onUpdateCellStyle({ [style]: true });
  };

  const handleUpdateAlignment = (alignment: 'left' | 'center' | 'right') => {
    onUpdateCellStyle({ textAlign: alignment });
  };

  const handleAddFilter = () => {
    if (selection) {
      onAddFilter(selection.start.col);
    }
  };

  const handleSortColumn = (direction: 'asc' | 'desc') => {
    if (selection) {
      onSortColumn(selection.start.col, direction);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b bg-white z-10 sticky top-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <Button onClick={handleInsertRow} disabled={!isSelectionActive}>Insert Row</Button>
              <Button onClick={handleInsertColumn} disabled={!isSelectionActive}>Insert Column</Button>
            </div>
          </PopoverContent>
        </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Minus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col gap-2">
            <Button onClick={handleDeleteRow} disabled={!isSelectionActive}>Delete Row</Button>
            <Button onClick={handleDeleteColumn} disabled={!isSelectionActive}>Delete Column</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={onMergeCells} disabled={!isSelectionActive}>
        <Merge className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={onCopy} disabled={!isSelectionActive}>
        <Copy className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={onPaste}>
        <Clipboard className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={() => handleUpdateFontStyle('bold')}>
        <Bold className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={() => handleUpdateFontStyle('italic')}>
        <Italic className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={() => handleUpdateFontStyle('underline')}>
        <Underline className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <AlignLeft className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col gap-2">
            <Button onClick={() => handleUpdateAlignment('left')}>
              <AlignLeft className="h-4 w-4 mr-2" /> Left
            </Button>
            <Button onClick={() => handleUpdateAlignment('center')}>
              <AlignCenter className="h-4 w-4 mr-2" /> Center
            </Button>
            <Button onClick={() => handleUpdateAlignment('right')}>
              <AlignRight className="h-4 w-4 mr-2" /> Right
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Select onValueChange={(value) => onUpdateCellStyle({ fontSize: parseInt(value) })}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Font Size" />
        </SelectTrigger>
        <SelectContent>
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map((size) => (
            <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={onToggleCellLock}>
        <Lock className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={handleAddFilter} disabled={!isSelectionActive}>
        <Filter className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <SortAsc className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col gap-2">
            <Button onClick={() => handleSortColumn('asc')} disabled={!isSelectionActive}>
              <SortAsc className="h-4 w-4 mr-2" /> Sort Ascending
            </Button>
            <Button onClick={() => handleSortColumn('desc')} disabled={!isSelectionActive}>
              <SortDesc className="h-4 w-4 mr-2" /> Sort Descending
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={onCreateChart}>
          <BarChart2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
export default Toolbar;