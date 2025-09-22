import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
// import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transfer } from "@/types/transfers";
import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../shared/ActionButton";

export const draftTransfersTableColum = (): ColumnDef<Transfer>[] => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();

  return [
    {
      accessorKey: "customer",
      header: t("modules.pages.transfers.table.columns.customer"),
      cell: ({ row }) => {
        const customer = (row.original as any).customer;
        return (
          <span className="font-medium">
            <Link
              to={ROUTES.CUSTOMERS.EDIT(customer.id)}
              className="hover:underline"
            >
              {customer.first_name + " " + customer.last_name}
            </Link>
          </span>
        );
      },
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
      accessorKey: "recipient",
      header: t("modules.pages.transfers.table.columns.recipient"),
      cell: ({ row }) => {
        const recipient = (row.original as any).recipient;
        return (
          <span className="font-medium">
            <Link
              to={ROUTES.RECIPIENTS.EDIT(recipient.id)}
              className="hover:underline"
            >
              {recipient.first_name + " " + recipient.last_name}
            </Link>
          </span>
        );
      },
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
      accessorKey: "account number",
      header: "Account Number",
    },

    {
      accessorKey: "sending_amount",
      header: t("modules.pages.transfers.table.columns.sending_amount"),
    },
    {
      accessorKey: "recipient-get",
      header: "Recipient Gets",
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
      header: "Total To Pay",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      id: "actions",
      header: t("modules.pages.transfers.table.columns.actions"),
      enableHiding: false,
      cell: ({ row }) => {
        const draftTransfer = row.original;
        return (
          <ActionButton
            type="link"
            title="Continue"
            onClick={() =>
              navigate(
                ROUTES.SEND_REMITTANCE.EDIT(draftTransfer.reference_number)
              )
            }
          />
        );
      },
    },
  ];
};
