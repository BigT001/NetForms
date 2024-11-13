"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { SpreadsheetProps } from './types';
import Toolbar from './_components/Toolbar';
import FormulaBar from './_components/FormulaBar';
import Grid from './_components/Grid';
import SheetTabs from './_components/SheetTabs';
import ChartDialog from './_components/ChartDialog';
import { useSpreadsheet } from './hooks/useSpreadsheet';

export const Spreadsheet: React.FC<SpreadsheetProps> = ({
  initialRows = 100,
  initialColumns = 26,
  className,
  onDataChange,
  readOnly = false,
  showToolbar = true,
  showFormulaBar = true,
  defaultColumnWidth = 100,
  defaultRowHeight = 25,
  maxColumns = 1000,
  maxRows = 1000,
}) => {
  const {
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
  } = useSpreadsheet({
    initialRows,
    initialColumns,
    onDataChange,
    defaultColumnWidth,
    defaultRowHeight,
  });

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {showToolbar && (
        <Toolbar
          selection={selection}
          sheets={sheets}
          activeSheetId={activeSheetId}
          onInsertRow={insertRow}
          onInsertColumn={insertColumn}
          onDeleteRow={deleteRow}
          onDeleteColumn={deleteColumn}
          onMergeCells={mergeCells}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onUpdateCellStyle={updateCellStyle}
          onToggleCellLock={toggleCellLock}
          onAddFilter={addFilter}
          onSortColumn={sortColumn}
          onCreateChart={() => setShowChartDialog(true)}
        />
      )}
      
      {showFormulaBar && (
        <FormulaBar
          activeCell={activeCell}
          sheets={sheets}
          activeSheetId={activeSheetId}
          onCellChange={handleCellChange}
        />
      )}
      
      <div className="flex-1 flex">
        <Grid
          sheets={sheets}
          activeSheetId={activeSheetId}
          selection={selection}
          activeCell={activeCell}
          readOnly={readOnly}
          onCellSelect={handleCellSelect}s
          onCellChange={handleCellChange}
          rowHeights={rowHeights}
          colWidths={colWidths}
          visibleRange={visibleRange}
        />
        
        <SheetTabs
          sheets={sheets}
          activeSheetId={activeSheetId}
          onAddSheet={addSheet}
          onSelectSheet={setActiveSheetId}
        />
      </div>

      <ChartDialog
        open={showChartDialog}
        onOpenChange={setShowChartDialog}
      />
    </div>
  );
};
export default Spreadsheet;