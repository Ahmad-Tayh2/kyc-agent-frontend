import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

export const SupportTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "",
        header: "Ref#",
      },
      {
        accessorKey: "",
        header: "Type",
      },
      {
        accessorKey: "",
        header: "Date",
      },
      {
        accessorKey: "",
        header: "Summary",
      },
      {
        accessorKey: "",
        header: "Attachments",
      },
      {
        accessorKey: "",
        header: "Resolution",
      },
      {
        accessorKey: "actions",
        header: "Actions",
      },
    ],
    []
  );
};
