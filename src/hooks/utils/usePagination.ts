import { useState, useMemo, useCallback, useEffect } from "react";

interface UsePaginationProps {
  total?: number; // total number of items
  perPage?: number; // items per page (default = 10)
  initialPage?: number; // starting page (default = 1)
}

export const usePagination = ({
  total,
  perPage = 1,
  initialPage = 1,
}: UsePaginationProps) => {
  const [page, setPage] = useState(initialPage);
  const [per_page, setPerPage] = useState(perPage);

  // last page depends on total + perPage
  const lastPage = useMemo(() => {
    if (total) {
      return Math.max(1, Math.ceil(total / perPage));
    } else return 1;
  }, [total, perPage]);

  // go to a specific page safely
  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber < 1) setPage(1);
      else if (pageNumber > lastPage) setPage(lastPage);
      else setPage(pageNumber);
    },
    [lastPage]
  );
  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, lastPage));
  }, [lastPage]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    per_page,
    total,
    last_page: lastPage,
    // helpers
    setPage: goToPage,
    setPerPage,
    nextPage,
    prevPage,
    reset,
  };
};
