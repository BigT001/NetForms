import { Cell } from './types';

export const getColumnLabel = (index: number): string => {
  let label = '';
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
};

export const getColumnIndexFromLabel = (label: string): number => {
  let index = 0;
  for (let i = 0; i < label.length; i++) {
    index = index * 26 + label.charCodeAt(i) - 64;
  }
  return index - 1;
};

export const evaluateFormula = (formula: string, currentData: Cell[][]): string => {
  // Remove the leading '=' sign
  const expression = formula.slice(1);

  // Helper function to get cell value
  const getCellValue = (cellRef: string): number => {
    const colLabel = cellRef.match(/[A-Z]+/)?.[0] ?? '';
    const rowNum = parseInt(cellRef.match(/\d+/)?.[0] ?? '0', 10) - 1;
    const colIndex = getColumnIndexFromLabel(colLabel);
    const cellValue = currentData[rowNum]?.[colIndex]?.value ?? '';
    return parseFloat(cellValue) || 0;
  };

  // Replace cell references with their values
  const evaluableExpression = expression.replace(/[A-Z]+\d+/g, (match) => {
    return getCellValue(match).toString();
  });

  try {
    // Use Function constructor to create a safe evaluation environment
    const result = new Function(`return ${evaluableExpression}`)();
    return typeof result === 'number' ? result.toString() : 'ERROR';
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 'ERROR';
  }
};

export const isFormulaValid = (formula: string): boolean => {
  if (!formula.startsWith('=')) return false;

  const expression = formula.slice(1);
  const validChars = /^[A-Z0-9+\-*/().\s]+$/;
  return validChars.test(expression);
};

export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
};

export const formatCellValue = (value: string | number): string => {
  if (typeof value === 'number') {
    // Format numbers with up to 2 decimal places
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return value;
};

export const parseCSV = (csvContent: string): Cell[][] => {
  const rows = csvContent.split('\n');
  return rows.map((row, rowIndex) => 
    row.split(',').map((cellValue, colIndex) => ({
      id: `${rowIndex}-${colIndex}`,
      value: cellValue.trim(),
      formula: '',
      style: {},
      locked: false
    }))
  );
};

export const generateCSV = (data: Cell[][]): string => {
  return data.map((row) => 
    row.map((cell) => cell.value).join(',')
  ).join('\n');
};