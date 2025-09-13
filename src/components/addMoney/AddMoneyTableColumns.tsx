import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/shared/StatusLabel";
// import DropdownMenuOptions from "@/components/shared/DropdownMenu";
// import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
// import EditIcon from "@/assets/icons/edit.svg?react";
// import { ROUTES } from "@/constants/routes";
import { CUSTOMER_STATUS_COLORS } from "@/constants/appConstants";

export const AddMoneyTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "reference_number",
        header: "Transaction Number",
      },

      {
        accessorKey: "",
        header: "Date",
      },
      {
        accessorKey: "",
        header: "Currency",
      },
      {
        accessorKey: "",
        header: "Amount",
      },
      {
        accessorKey: "",
        header: "Payment Method",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.getValue("status");
          const color =
            CUSTOMER_STATUS_COLORS[
              value as keyof typeof CUSTOMER_STATUS_COLORS
            ] || "#000000";
          return <StatusLabel value={value} color={color} />;
        },
      },
    ],
    []
  );
};
