import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import EditIcon from "@/assets/icons/edit.svg?react";
import DeleteIcon from "@/assets/icons/delete.svg";

import type { CustomerType } from "@/types/customers";

const menu = (remittanceCartId: string | number) => {
  console.log("remittanceCartId = ", remittanceCartId);
  return [
    {
      label: "Edit",
      icon: <EditIcon />,
      onClick: () => {},
    },
    {
      label: "Delete",
      icon: <DeleteIcon />,
      onClick: () => {},
    },
  ];
};

export const remittanceCartColumns = (): ColumnDef<CustomerType>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "reference_number",
        header: "Tr. #",
      },
      {
        accessorKey: "first_name",
        header: "Recipient",
      },
      {
        accessorKey: "last_name",
        header: "Destination country",
      },
      {
        accessorKey: "country",
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
        cell: ({ row }) => {
          return (
            <div className="capitalize">
              +{row.original?.country_phone_code} {row.original.phone_number}
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Received Amount",
        cell: ({ row }) => {
          const value: string = row.getValue("created_at");
          const date = parseISO(value);
          const formattedDate = format(date, "dd-MM-yyyy");
          return formattedDate;
        },
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
          const remittanceCart = row.original;
          return (
            <DropdownMenuOptions
              menu={menu(remittanceCart.id)}
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
