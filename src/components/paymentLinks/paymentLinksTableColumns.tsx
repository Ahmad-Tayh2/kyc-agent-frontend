import { useMemo } from "react";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerType } from "@/types/customers";
import StatusLabel from "../shared/StatusLabel";

export const paymentLinksColumns = (): ColumnDef<CustomerType>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "customer",
        header: "Customer",
      },
      {
        accessorKey: "created_at",
        header: "Date Created",
        cell: ({ row }) => {
          const date: string = row.getValue("created_at");
          return <div className="capitalize">{format(date, "dd-MM-yyyy")}</div>;
        },
      },
      {
        accessorKey: "transactions_count",
        header: "Transactions",
        cell: ({ row }) => {
          const payable: { transactions_count?: number } =
            row.getValue("payable");

          return (
            <div className="capitalize">{payable?.transactions_count}</div>
          );
        },
      },
      {
        accessorKey: "payable_type",
        header: "Type",
      },
      {
        accessorKey: "final_amount",
        header: "Amount To Pay",
        cell: ({ row }) => {
          const payable: { final_amount?: number; currency?: string } =
            row.getValue("payable");

          return (
            <div className="capitalize">
              {payable?.final_amount} {payable?.currency}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status: string = row.getValue("status");

          return <StatusLabel value={status} color="#00ff00" />;
        },
      },
      {
        accessorKey: "last_name",
        header: "Action",
      },
    ],
    []
  );
};
export const customerPaymentLinksColumns = (): ColumnDef<CustomerType>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
          const date: string = row.getValue("created_at");
          return <div className="capitalize">{format(date, "dd-MM-yyyy")}</div>;
        },
      },
      {
        accessorKey: "transactions",
        header: "Transactions",
        cell: ({ row }) => {
          const payable: { transactions_count?: number } =
            row.getValue("payable");

          return (
            <div className="capitalize">{payable?.transactions_count}</div>
          );
        },
      },
      {
        accessorKey: "final_amount",
        header: "Amount To Pay",
        cell: ({ row }) => {
          const payable: { final_amount?: number; currency?: string } =
            row.getValue("payable");

          return (
            <div className="capitalize">
              {payable?.final_amount} {payable?.currency}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status: string = row.getValue("status");

          return <StatusLabel value={status} color="#00ff00" />;
        },
      },
      {
        accessorKey: "action",
        header: "Action",
      },
    ],
    []
  );
};
