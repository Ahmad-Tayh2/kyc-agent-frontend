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
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export const AccountStatementsTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "transaction_reference",
        header: "Tr. #",
        cell: ({ row }) => {
          const transaction_reference: string = row.getValue(
            "transaction_reference"
          );

          return (
            <div className="capitalize">
              <Link
                to={ROUTES.SEND_REMITTANCE.EDIT(transaction_reference)}
                className="font-medium text-xs hover:underline"
              >
                {transaction_reference}
              </Link>
            </div>
          );
        },
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
        cell: ({ row }) => {
          const currency = row.original.currency;
          const debit = row.original.debit;
          return (
            <div>
              {debit} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: "credit",
        header: "Credit",
        cell: ({ row }) => {
          const currency = row.original.currency;
          const credit = row.original.credit;
          return (
            <div>
              {credit} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: "wallet_balance_after",
        header: "Balance After",
        cell: ({ row }) => {
          const currency = row.original.currency;
          const wallet_balance_after = row.original.wallet_balance_before;
          return (
            <div>
              {wallet_balance_after} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: "wallet_balance_before",
        header: "Balance Before",
        cell: ({ row }) => {
          const currency = row.original.currency;
          const wallet_balance_before = row.original.wallet_balance_before;
          return (
            <div>
              {wallet_balance_before} {currency}
            </div>
          );
        },
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
