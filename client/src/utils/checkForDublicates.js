export function checkForDuplicates(array) {
    const seen = new Set();
  
    for (const item of array) {
      if (seen.has(item)) {
        throw new Error(`S-a găsit un duplicat: ${item}`);
      }
      seen.add(item);
    }
    return true; // Nicio valoare duplicată
  }
  