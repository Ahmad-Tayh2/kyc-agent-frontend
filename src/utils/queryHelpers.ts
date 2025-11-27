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

export function appendArrayQueryParam(
  filterString: string,
  key: string,
  values?: string[] | number[]
): string {
  if (!values || values.length === 0) {
    return filterString;
  }

  let result = filterString;
  const startSeparator = result === "" ? "?" : "&";

  values.forEach((value, index) => {
    const encodedValue = encodeURIComponent(String(value));
    if (index === 0) result += `${startSeparator}${key}[]=${encodedValue}`;
    else result += `&${key}[]=${encodedValue}`;
  });

  return result;
}

function addOneDay(dateString: string) {
  // Parse the string into a Date object
  const date = new Date(dateString);

  // Add one day (in milliseconds)
  date.setDate(date.getDate() + 1);

  // Convert back to YYYY-MM-DD string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function buildFilterString(filters: Record<string, any>): string {
  let filterString = "";
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value) && value.length > 0) {
        // Use array format for specific fields that should be sent as arrays
        if (
          key === "status" ||
          key === "remittance_methods_ids" ||
          key === "ids" ||
          key === "countries" ||
          key === "country_ids" ||
          key === "currencies" ||
          key === "type" ||
          key === "send_countries" ||
          key === "receive_countries" ||
          key === "country_codes" ||
          key === "customer_ids"
        ) {
          filterString = appendArrayQueryParam(filterString, key, value);
        } else {
          // For other arrays, use JSON format
          filterString = appendQueryParam(filterString, key, value);
        }
      } else if (!Array.isArray(value)) {
        if (key === "date_to") {
          // Adjust the end date by adding 1 day to include the full end date in the API range
          const newDateTo = addOneDay(value);
          filterString = appendQueryParam(filterString, key, newDateTo);
        } else filterString = appendQueryParam(filterString, key, value);
      }
    }
  });

  return filterString;
}
