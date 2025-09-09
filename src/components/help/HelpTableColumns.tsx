import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

export const helpTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "",
        header: "Title",
      },
      {
        accessorKey: "",
        header: "Description",
      },
      {
        accessorKey: "",
        header: "Download Document",
      },
    ],
    []
  );
};
