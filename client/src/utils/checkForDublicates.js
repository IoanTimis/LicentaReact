export function checkForDuplicates(array) {
    const seen = new Set();
  
    for (const item of array) {
      if (seen.has(item)) {
        return true;
      }
      seen.add(item);
    }
    return false; 
  }
  