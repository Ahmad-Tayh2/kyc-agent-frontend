import StatusLabel from "@/components/shared/StatusLabel";
import { ROUTES } from "@/constants/routes";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
// import { formatCurrency, formatDate } from "@/lib/utils";
import EditIcon from "@/assets/icons/edit.svg?react";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import type { Transfer } from "@/types/transfers";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { TRASACTIONS_STATUSES_COLORS } from "@/constants/appConstants";
import LinkList from "../shared/LinkList";

export const transferColumns = (): ColumnDef<Transfer>[] => {
  const [t] = useTranslation("global");
  const menu = (transferRef: string) => {
    return [
      {
        label: "View Details",
        icon: <ViewDetailsIcon />,
        onClick: () => {},
        link: ROUTES.TRANSFERS.DETAILS(transferRef),
      },
      {
        label: "Edit",
        icon: <EditIcon />,
        onClick: () => {},
        link: ROUTES.SEND_REMITTANCE.EDIT(transferRef),
      },
    ];
  };

  return [
    {
      accessorKey: "reference_number",
      header: t("modules.pages.transfers.table.columns.id"),
    },
    {
      accessorKey: "created_at",
      header: t("modules.pages.transfers.table.columns.created_at"),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return <div>{format(date, "yy-MM-dd HH:mm")}</div>;
      },
    },
    {
      accessorKey: "remittance_method",
      header: t("modules.pages.transfers.table.columns.remittance_method"),
      cell: ({ row }) => {
        const remittance_method = (row.original as any).remittance_method;
        return (
          <span>
            {remittance_method?.name ? remittance_method.name : "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "customer",
      header: t("modules.pages.transfers.table.columns.customer"),
      cell: ({ row }) => {
        const customer = (row.original as any).customer;
        return (
          <LinkList
            data={[
              {
                label: `${customer.first_name} ${customer.last_name}`,
                link: ROUTES.CUSTOMERS.DETAILS(customer?.id ?? ""),
              },
            ]}
          />
        );
      },
    },
    {
      accessorKey: "recipient",
      header: t("modules.pages.transfers.table.columns.recipient"),
      cell: ({ row }) => {
        const recipient = (row.original as any).recipient;
        return (
          <LinkList
            data={[
              {
                label: `${recipient.first_name} ${recipient.last_name}`,
                link: ROUTES.RECIPIENTS.DETAILS(recipient?.id ?? ""),
              },
            ]}
          />
        );
      },
    },
    // {
    //   accessorKey: "send_currency",
    //   header: t("modules.pages.transfers.table.columns.send_currency"),
    // },
    {
      accessorKey: "sent_amount",
      header: t("modules.pages.transfers.table.columns.sending_amount"),
      cell: ({ row }) => {
        const sent_amount = row.original.sent_amount;
        const send_currency = row.original.send_currency;
        return (
          <span>
            {sent_amount} {send_currency}
          </span>
        );
      },
    },
    {
      accessorKey: "send_country",
      header: t("modules.pages.transfers.table.columns.send_country"),
      cell: ({ row }) => {
        const send_country = (row.original as any).send_country;
        return <span title={send_country?.name}>{send_country?.iso2}</span>;
      },
    },
    {
      accessorKey: "receive_country",
      header: t("modules.pages.transfers.table.columns.receive_country"),
      cell: ({ row }) => {
        const receive_country = (row.original as any).receive_country;
        return (
          <span title={receive_country?.name}>{receive_country?.iso2}</span>
        );
      },
    },
    {
      accessorKey: "receive_amount",
      header: t("modules.pages.transfers.table.columns.receive_amount"),
      cell: ({ row }) => {
        const receive_amount = row.original.receive_amount;
        const receive_currency = row.original.receive_currency;
        return (
          <span>
            {receive_amount} {receive_currency}
          </span>
        );
      },
    },
    {
      accessorKey: "sending_agent_commission_amount",
      header: t(
        "modules.pages.transfers.table.columns.sending_agent_commission_amount"
      ),
      cell: ({ row }) => {
        const sending_agent_commission_amount =
          row.original.sending_agent_commission_amount;
        const send_currency = row.original.send_currency;
        return (
          <span>
            {sending_agent_commission_amount} {send_currency}
          </span>
        );
      },
    },
    {
      accessorKey: "extra_fees_amount",
      header: t("modules.pages.transfers.table.columns.extra_fees_amount"),
      cell: ({ row }) => {
        const extra_fees_amount = row.original.extra_fees_amount;
        const send_currency = row.original.send_currency;
        return (
          <span>
            {extra_fees_amount} {send_currency}
          </span>
        );
      },
    },
    {
      accessorKey: "total_payable_amount",
      header: t("modules.pages.transfers.table.columns.payout_amount"),
      cell: ({ row }) => {
        const total_payable_amount = row.original.total_payable_amount;
        const send_currency = row.original.send_currency;
        return (
          <span>
            {total_payable_amount} {send_currency}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("modules.pages.transfers.table.columns.status"),
      cell: ({ row }) => {
        const value: string = row.getValue("status") as string;
        const color =
          TRASACTIONS_STATUSES_COLORS[
            value as keyof typeof TRASACTIONS_STATUSES_COLORS
          ] || "#000000";
        return <StatusLabel value={value} color={color} />;
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
      enableHiding: false,
      cell: ({ row }) => {
        const transfer = row.original;
        return (
          <DropdownMenuOptions
            menu={menu(transfer.reference_number)}
            trigger={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            }
          />
        );
      },
    },
  ];
};
