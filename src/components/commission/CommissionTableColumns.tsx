import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/shared/StatusLabel";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
// import EditIcon from "@/assets/icons/edit.svg?react";
// import { ROUTES } from "@/constants/routes";
import { TRASACTIONS_STATUSES_COLORS } from "@/constants/appConstants";
import { ROUTES } from "@/constants/routes";

const menu = (transferRef: string) => {
  return [
    // {
    //   label: "Report Issue",
    //   // icon: <SendMoneyIcon />,
    //   onClick: () => {},
    // },
    {
      label: "View Transaction",
      icon: <ViewDetailsIcon />,
      link: ROUTES.TRANSFERS.DETAILS(transferRef),
      onClick: () => {},
    },
  ];
};

export const CommissionTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "transaction_reference",
        header: "Tr. #",
      },

      {
        accessorKey: "transaction_date",
        header: "Sending Date",
      },
      {
        accessorKey: "sender_name",
        header: "Sender",
      },
      {
        accessorKey: "receiver_name",
        header: "Recipient Full Name",
      },
      {
        accessorKey: "send_amount",
        header: "Sent Amount",
      },
      {
        accessorKey: "receive_amount",
        header: "Received Amount",
      },
      {
        accessorKey: "comm", //TODO: to verify what to display here
        header: "Comm.",
      },
      {
        accessorKey: "extra_fees",
        header: "Extra Fees",
      },
      {
        accessorKey: "total_commission",
        header: "Total Comm.",
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
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const transferRef = row.original?.transaction_reference;
          console.log(row);
          return (
            <DropdownMenuOptions
              menu={menu(transferRef)}
              trigger={
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              }
            />
          );
        },
      },
    ],
    []
  );
};
