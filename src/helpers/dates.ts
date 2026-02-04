import { DateTime } from "luxon";
export function formatDateToYMDhhmm(isoString: string): string {
  // Parse the input as UTC time (since the input ends with Z)
  const dt = DateTime.fromISO(isoString, { zone: "utc" });

  if (!dt.isValid) {
    // Fallback: try parsing with a more permissive approach
    const fallback = DateTime.fromISO(isoString);
    if (fallback.isValid) {
      return fallback.toFormat("yyyy-MM-dd HH:mm");
    }
    // If still invalid, return the original string or an empty string
    return "";
  }

  // Format as "YYYY-MM-DD hh:mm" using 24-hour clock
  return dt.toFormat("yyyy-MM-dd HH:mm");
}
