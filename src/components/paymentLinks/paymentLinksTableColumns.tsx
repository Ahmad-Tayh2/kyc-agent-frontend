import { useMemo } from "react";
// import { parseISO, format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
// import StatusLabel from "@/components/shared/StatusLabel";
// import { CUSTOMER_STATUS_COLORS } from "@/constants/appConstants";
import type { CustomerType } from "@/types/customers";

export const paymentLinksColumns = (): ColumnDef<CustomerType>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "reference_number",
        header: "Customer",
      },
      {
        accessorKey: "first_name",
        header: "Date",
      },
      {
        accessorKey: "last_name",
        header: "Transactions",
      },
      {
        accessorKey: "last_name",
        header: "Type",
      },
      {
        accessorKey: "last_name",
        header: "Amount To Pay",
      },
      {
        accessorKey: "last_name",
        header: "Status",
      },
      {
        accessorKey: "last_name",
        header: "Action",
      },
    ],
    []
  );
};
