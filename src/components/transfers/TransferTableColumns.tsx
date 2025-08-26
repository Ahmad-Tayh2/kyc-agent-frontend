import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import StatusLabel from "@/components/shared/StatusLabel";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transfer } from "@/types/transfers";

export const transferColumns = (): ColumnDef<Transfer>[] => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();

  return [
    {
      accessorKey: "id",
      header: t("modules.pages.transfers.table.columns.id"),
      cell: ({ row }) => (
        <span className="font-medium">#{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "send_currency",
      header: t("modules.pages.transfers.table.columns.send_currency"),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("send_currency")}</span>
      ),
    },
    {
      accessorKey: "sent_amount_in_send_currency",
      header: t("modules.pages.transfers.table.columns.sent_amount"),
      cell: ({ row }) => {
        const amount = row.getValue("sent_amount_in_send_currency") as number;
        const currency = row.getValue("send_currency") as string;
        return (
          <span className="font-medium">
            {formatCurrency(amount, currency)}
          </span>
        );
      },
    },
    {
      accessorKey: "receive_currency",
      header: t("modules.pages.transfers.table.columns.receive_currency"),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("receive_currency")}</span>
      ),
    },
    {
      accessorKey: "receive_amount_in_send_currency",
      header: t("modules.pages.transfers.table.columns.receive_amount"),
      cell: ({ row }) => {
        const amount = row.getValue("receive_amount_in_send_currency") as number;
        const currency = row.getValue("receive_currency") as string;
        return (
          <span className="font-medium">
            {formatCurrency(amount, currency)}
          </span>
        );
      },
    },
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
      cell: ({ row }) => {
        const method = row.getValue("payment_method") as string;
        return (
          <span className="capitalize">
            {method.replace(/_/g, " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("modules.pages.transfers.table.columns.created_at"),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return <span>{formatDate(date)}</span>;
      },
    },
    {
      id: "actions",
      header: t("modules.pages.transfers.table.columns.actions"),
      cell: ({ row }) => {
        const transfer = row.original;
        return (
          <button
            onClick={() => navigate(ROUTES.TRANSFERS.DETAILS(transfer.id))}
            className="text-primary hover:text-primary/80 font-medium"
          >
            {t("modules.pages.transfers.table.actions.view_details")}
          </button>
        );
      },
    },
  ];
}; 