export const getColumnLabel = (index: number): string => {
    let label = '';
    let num = index;
    
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
    }
    
    return label;
  };
  