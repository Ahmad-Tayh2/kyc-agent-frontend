import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import StatusLabel from "@/components/shared/StatusLabel";
// import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transfer } from "@/types/transfers";
import { Link } from "react-router-dom";

export const transferColumns = (): ColumnDef<Transfer>[] => {
  const [t] = useTranslation("global");

  return [
    {
      accessorKey: "id",
      header: t("modules.pages.transfers.table.columns.id"),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "sending_date",
      header: t("modules.pages.transfers.table.columns.sending_date"),
    },
    {
      accessorKey: "remittance_method",
      header: t("modules.pages.transfers.table.columns.remittance_method"),
      cell: ({ row }) => {
        const remittance_method = (row.original as any).remittance_method;
        return <span className="font-medium">{remittance_method.name}</span>;
      },
    },
    {
      accessorKey: "customer",
      header: t("modules.pages.transfers.table.columns.customer"),
      cell: ({ row }) => {
        const customer = (row.original as any).customer;
        return (
          <span className="font-medium">
            <Link to={ROUTES.CUSTOMERS.EDIT(customer.id)}>
              {customer.first_name + " " + customer.last_name}
            </Link>
          </span>
        );
      },
    },
    {
      accessorKey: "recipient",
      header: t("modules.pages.transfers.table.columns.recipient"),
      cell: ({ row }) => {
        const recipient = (row.original as any).recipient;
        return (
          <span className="font-medium">
            <Link to={ROUTES.RECIPIENTS.EDIT(recipient.id)}>
              {recipient.first_name + " " + recipient.last_name}
            </Link>
          </span>
        );
      },
    },
    {
      accessorKey: "send_currency",
      header: t("modules.pages.transfers.table.columns.send_currency"),
    },
    {
      accessorKey: "send_country",
      header: t("modules.pages.transfers.table.columns.send_country"),
      cell: ({ row }) => {
        const send_country = (row.original as any).send_country;
        return <span className="font-medium">{send_country.name}</span>;
      },
    },
    {
      accessorKey: "receive_country",
      header: t("modules.pages.transfers.table.columns.receive_country"),
      cell: ({ row }) => {
        const receive_country = (row.original as any).receive_country;
        return <span className="font-medium">{receive_country.name}</span>;
      },
    },
    {
      accessorKey: "sending_amount",
      header: t("modules.pages.transfers.table.columns.sending_amount"),
    },
    {
      accessorKey: "total_commission_amount",
      header: t(
        "modules.pages.transfers.table.columns.total_commission_amount"
      ),
    },
    {
      accessorKey: "extra_fees_amount",
      header: t("modules.pages.transfers.table.columns.extra_fees_amount"),
    },
    {
      accessorKey: "payout_amount",
      header: t("modules.pages.transfers.table.columns.payout_amount"),
    },
    // {
    //   accessorKey: "sent_amount_in_send_currency",
    //   header: t("modules.pages.transfers.table.columns.sent_amount"),
    //   cell: ({ row }) => {
    //     const amount = row.getValue("sent_amount_in_send_currency") as number;
    //     const currency = row.getValue("send_currency") as string;
    //     return (
    //       <span className="font-medium">
    //         {formatCurrency(amount, currency)}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "receive_currency",
    //   header: t("modules.pages.transfers.table.columns.receive_currency"),
    //   cell: ({ row }) => (
    //     <span className="font-medium">{row.getValue("receive_currency")}</span>
    //   ),
    // },
    // {
    //   accessorKey: "receive_amount_in_send_currency",
    //   header: t("modules.pages.transfers.table.columns.receive_amount"),
    //   cell: ({ row }) => {
    //     const amount = row.getValue(
    //       "receive_amount_in_send_currency"
    //     ) as number;
    //     const currency = row.getValue("receive_currency") as string;
    //     return (
    //       <span className="font-medium">
    //         {formatCurrency(amount, currency)}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "status",
      header: t("modules.pages.transfers.table.columns.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusLabel value={status} />;
      },
    },
    {
      accessorKey: "payment_method",
      header: t("modules.pages.transfers.table.columns.payment_method"),
    },
    // {
    //   accessorKey: "created_at",
    //   header: t("modules.pages.transfers.table.columns.created_at"),
    //   cell: ({ row }) => {
    //     const date = row.getValue("created_at") as string;
    //     return <span>{formatDate(date)}</span>;
    //   },
    // },
    {
      id: "actions",
      header: t("modules.pages.transfers.table.columns.actions"),
    },
  ];
};
