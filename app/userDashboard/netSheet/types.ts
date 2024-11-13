export interface Cell {
    value: string;
    id: string;
    formula?: string;
    style?: CellStyle;
    mergeInfo?: MergeInfo;
    locked?: boolean;
  }
  
  export interface CellStyle {
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
  
  export interface MergeInfo {
    startRow: number;
    startCol: number;
    rowSpan: number;
    colSpan: number;
    hidden?: boolean;
  }
  
  export interface Selection {
    start: { row: number; col: number };
    end: { row: number; col: number };
  }
  
  export interface SpreadsheetProps {
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
  
  export interface Sheet {
    id: string;
    name: string;
    data: Cell[][];
  }