/**
 * Deep patch an object with another object
 * - Step 1: Take the original object
 * - Step 2: Loop through the keys of the new object
 * - 2.1: If key doesn't exists, add key & value
 * - 2.2: If key exists, set key to deepPatch(originalValue, value)
 *
 * @param originalData
 * @param partialData
 * @returns
 */
export function deepPatch(originalData: any, partialData: any): any {
  if (isObject(originalData) && isObject(partialData)) {
    const mergedObject = { ...originalData };

    Object.entries(partialData).forEach(([key, value]) => {
      if (!mergedObject[key]) {
        mergedObject[key] = value;
      } else {
        mergedObject[key] = deepPatch(mergedObject[key], value);
      }
    });

    return mergedObject;
  } else {
    // If original data or partialData is not an ojbect, we can't merge, we return partialData by default
    return partialData;
  }
}

export function isObject(value: unknown): boolean {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
