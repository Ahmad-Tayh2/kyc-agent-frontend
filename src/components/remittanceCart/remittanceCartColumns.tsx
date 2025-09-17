import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import EditIcon from "@/assets/icons/edit.svg?react";
import DeleteIcon from "@/assets/icons/delete.svg?react";

import type { CustomerType } from "@/types/customers";
import { useRemoveTransactionFromCart } from "@/hooks/data/useRemittanceCarts";
import { ROUTES } from "@/constants/routes";

export const remittanceCartColumns = (): ColumnDef<CustomerType>[] => {
  const { mutateAsync: removeTransactionFromCart } =
    useRemoveTransactionFromCart();
  const menu = (transferId: number) => {
    return [
      {
        label: "Edit",
        icon: <EditIcon />,
        onClick: () => {},
        link: ROUTES.SEND_REMITTANCE.EDIT(transferId),
      },
      // {
      //   label: "Delete",
      //   icon: <DeleteIcon />,
      //   onClick: () => {},
      // },
      {
        label: "Remove From Cart",
        icon: <DeleteIcon />,
        onClick: () => {
          console.log(" start removing");
          removeTransactionFromCart(transferId);
        },
      },
    ];
  };
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Tr. #",
      },
      {
        accessorKey: "recipient",
        header: "Recipient",
        cell: ({ row }) => {
          const recipient: any = row.getValue("recipient");

          return (
            <div className="capitalize">
              {recipient?.first_name + " " + recipient?.last_name}
            </div>
          );
        },
      },
      {
        accessorKey: "country",
        header: "Destination country",
      },
      {
        accessorKey: "country22",
        header: "Remittance Method",
        cell: ({ row }) => {
          const country: {
            name: string;
          } = row.getValue("country");

          return <div className="capitalize">{country?.name}</div>;
        },
      },
      {
        accessorKey: "phone_number",
        header: "Sent Amount",
      },
      {
        accessorKey: "created_at",
        header: "Received Amount",
        // cell: ({ row }) => {
        //   const value: string = row.getValue("created_at");
        //   const date = parseISO(value);
        //   const formattedDate = format(date, "dd-MM-yyyy");
        //   return formattedDate;
        // },
      },
      {
        accessorKey: "transactions",
        header: "Comm.",
      },
      {
        accessorKey: "recipient_count",
        header: "Total To Pay",
      },

      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const transfer = row.original;
          return (
            <DropdownMenuOptions
              menu={menu(Number(transfer.id))}
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
