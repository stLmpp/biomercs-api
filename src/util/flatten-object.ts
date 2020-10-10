export function flattenObject(obj: { [key: string]: any }, propertyToFlatten: string): { [key: string]: any } {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (key === propertyToFlatten) {
      acc = { ...acc, ...value };
    } else {
      acc = { ...acc, [key]: value };
    }
    return acc;
  }, {});
}
