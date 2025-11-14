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
        accessorKey: "created_at",
        header: "Date",
      },
      {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => {
          const currency: any = row.getValue("currency");
          return <div>{currency?.code}</div>;
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "payment",
        header: "Payment Method",
        cell: ({ row }) => {
          const payment: any = row.getValue("payment");
          return <div>{payment?.provider_payment_method}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.original?.payment?.status;
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
