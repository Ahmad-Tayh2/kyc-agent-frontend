import { useMemo } from "react";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
// import type { PaymentLinkType } from "@/types/paymentLinks";
import StatusLabel from "../shared/StatusLabel";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { PAYMENT_LINKS_STATUSES_COLORS } from "@/constants/appConstants";
import ActionButton from "../shared/ActionButton";
import {
  useExpireLink,
  useRegenerateToken,
} from "@/hooks/data/usePaymentLinks";
import React from "react";

export const paymentLinksColumns = (): ColumnDef<any>[] => {
  const { mutateAsync: expireLink } = useExpireLink();
  const { mutateAsync: regenerateToken } = useRegenerateToken();
  return useMemo(
    () => [
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => {
          const customer: any = row.getValue("customer");
          return (
            <div>
              {customer?.id && customer?.first_name ? (
                <Link
                  to={ROUTES.CUSTOMERS.DETAILS(customer.id)}
                  className="hover:underline"
                >
                  {customer?.first_name} {customer?.last_name}
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No Customer found
                </span>
              )}
            </div>
          );
        },
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
        accessorKey: "transactions",
        header: "Transactions",
        cell: ({ row }) => {
          const transactions: string[] = row.getValue("transactions");

          return (
            <div className="capitalize">
              {transactions?.map((ref: string, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {index !== 0 && ", "}
                    <Link
                      to={ROUTES.SEND_REMITTANCE.EDIT(ref)}
                      className="font-medium text-xs hover:underline"
                    >
                      {ref}
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "amount_to_pay",
        header: "Amount To Pay",
        cell: ({ row }) => {
          const amount_to_pay: string = row.getValue("amount_to_pay");
          const currency: string = row.original.currency;

          return (
            <div className="font-medium">
              {amount_to_pay} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.getValue("status");
          //  "valid_link","expired_link", "successful_payment";
          const color =
            PAYMENT_LINKS_STATUSES_COLORS[
              value as keyof typeof PAYMENT_LINKS_STATUSES_COLORS
            ] || "#000000";
          return <StatusLabel value={value} color={color} />;
        },
      },
      {
        accessorKey: "actions",
        header: "Action",
        cell: ({ row }) => {
          const value: string = row.getValue("status");

          const id = row.original.id;
          switch (value) {
            case "valid_link":
              return (
                <ActionButton
                  title="Mark link as expired"
                  type="link"
                  className="text-[#DF6B1D]"
                  onClick={async () => await expireLink(id)}
                />
              );
            case "expired_link":
              return (
                <ActionButton
                  title="Generate payment link"
                  type="link"
                  className="text-[#00B386]"
                  onClick={async () => await regenerateToken(id)}
                />
              );
            case "successful_payment":
              return null;
            default:
              return null;
          }
        },
      },
    ],
    []
  );
};
export const customerPaymentLinksColumns = (): ColumnDef<any>[] => {
  const { mutateAsync: expireLink } = useExpireLink();
  const { mutateAsync: regenerateToken } = useRegenerateToken();
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
          const transactions: string[] = row.getValue("transactions");

          return (
            <div className="capitalize">
              {transactions?.map((ref: string, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {index !== 0 && ", "}
                    <Link
                      to={ROUTES.SEND_REMITTANCE.EDIT(ref)}
                      className="font-medium text-xs hover:underline"
                    >
                      {ref}
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>
          );
        },
      },
      {
        accessorKey: "amount_to_pay",
        header: "Amount To Pay",
        cell: ({ row }) => {
          const amount_to_pay: string = row.getValue("amount_to_pay");
          const currency: string = row.original.currency;

          return (
            <div className="font-medium">
              {amount_to_pay} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.getValue("status");
          //  "valid_link","expired_link", "successful_payment";
          const color =
            PAYMENT_LINKS_STATUSES_COLORS[
              value as keyof typeof PAYMENT_LINKS_STATUSES_COLORS
            ] || "#000000";
          return <StatusLabel value={value} color={color} />;
        },
      },
      {
        accessorKey: "actions",
        header: "Action",
        cell: ({ row }) => {
          const value: string = row.getValue("status");

          const id = row.original.id;
          switch (value) {
            case "valid_link":
              return (
                <ActionButton
                  title="Mark link as expired"
                  type="link"
                  className="text-[#DF6B1D]"
                  onClick={async () => await expireLink(id)}
                />
              );
            case "expired_link":
              return (
                <ActionButton
                  title="Generate payment link"
                  type="link"
                  className="text-[#00B386]"
                  onClick={async () => await regenerateToken(id)}
                />
              );
            case "successful_payment":
              return null;
            default:
              return null;
          }
        },
      },
    ],
    []
  );
};
