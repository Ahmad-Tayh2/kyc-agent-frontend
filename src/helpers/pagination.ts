export const getPagesLength = (last_page?: number): number => {
  if (last_page && last_page > 0) return last_page;
  return 0;
};

export const getPagesNumberToShow = (
  page: number,
  last_page: number
): (number | string)[] => {
  const pagesLength = getPagesLength(last_page);
  let display: (number | string)[] = [];

  if (last_page && pagesLength) {
    if (pagesLength < 7) {
      // Show all pages
      display = Array.from({ length: pagesLength }, (_, i) => i + 1);
    } else {
      const windowStart = Math.max(page - 1, 2);
      const windowEnd = Math.min(page + 1, pagesLength - 1);

      display.push(1);
      if (windowStart > 2) display.push("...");
      for (let p = windowStart; p <= windowEnd; p++) display.push(p);
      if (windowEnd < pagesLength - 1) display.push("...");
      display.push(pagesLength);
    }
  }

  return display;
};
