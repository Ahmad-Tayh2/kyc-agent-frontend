import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/shared/StatusLabel";
// import DropdownMenuOptions from "@/components/shared/DropdownMenu";
// import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
// import EditIcon from "@/assets/icons/edit.svg?react";
// import { ROUTES } from "@/constants/routes";
import { TRASACTIONS_STATUSES_COLORS } from "@/constants/appConstants";

export const AccountStatementsTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "transaction_reference",
        header: "Tr. #",
      },

      {
        accessorKey: "transaction_date",
        header: "Date",
      },
      {
        accessorKey: "extra_transaction_type",
        header: "Type",
      },
      {
        accessorKey: "comment",
        header: "Comment",
      },
      {
        accessorKey: "debit",
        header: "Debit",
      },
      {
        accessorKey: "credit",
        header: "Credit",
      },
      {
        accessorKey: "wallet_balance_after",
        header: "Balance After",
      },
      {
        accessorKey: "transaction_status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.getValue("transaction_status");
          const color =
            TRASACTIONS_STATUSES_COLORS[
              value as keyof typeof TRASACTIONS_STATUSES_COLORS
            ] || "#000000";
          return <StatusLabel value={value} color={color} />;
        },
      },
    ],
    []
  );
};
