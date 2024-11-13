import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet } from '../types';

interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onAddSheet: () => void;
  onSelectSheet: (sheetId: string) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({
  sheets,
  activeSheetId,
  onAddSheet,
  onSelectSheet,
}) => {
  return (
    <div className="w-40 border-l p-2">
      <h3 className="font-bold mb-2">Sheets</h3>
      {sheets.map(sheet => (
        <div
          key={sheet.id}
          className={cn(
            "cursor-pointer p-1 rounded",
            activeSheetId === sheet.id && "bg-blue-100"
          )}
          onClick={() => onSelectSheet(sheet.id)}
        >
          {sheet.name}
        </div>
      ))}
      <Button onClick={onAddSheet} className="mt-2 w-full">
        <Plus className="w-4 h-4 mr-1" />
        Add Sheet
      </Button>
    </div>
  );
};

export default SheetTabs;