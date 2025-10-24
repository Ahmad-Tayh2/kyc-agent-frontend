export const geAgentUserFromStorage = (): number | null => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user || null;
  } catch {
    return null;
  }
};
export const geAgentIdFromStorage = (): number | null => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.agent?.id || null;
  } catch {
    return null;
  }
};
