export function appendQueryParam(
  filterString: string,
  key: string,
  value?: string | number | boolean | object | any[]
): string {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  ) {
    return filterString; // Skip if value is empty, null, or undefined
  }

  let encodedValue: string;

  if (
    Array.isArray(value) ||
    (typeof value === "object" && !(value instanceof Date))
  ) {
    // For arrays or objects, JSON stringify and encodeURIComponent
    encodedValue = encodeURIComponent(JSON.stringify(value));
  } else {
    // For strings, numbers, booleans
    encodedValue = encodeURIComponent(String(value));
  }

  const separator = filterString === "" ? "?" : "&";

  return `${filterString}${separator}${key}=${encodedValue}`;
}
