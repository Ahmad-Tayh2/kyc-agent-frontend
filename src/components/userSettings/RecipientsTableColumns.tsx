import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import SendMoneyIcon from "@/assets/icons/send-money.svg?react";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
import { ROUTES } from "@/constants/routes";

export type Recipient = {
  id: string;
  reference_number: string;
  first_name: string;
  last_name: string;
  address: {
    country: {
      name: string;
    };
    city: {
      name: string;
    };
  };

  phone_number: string;
  created_at: string;
  status: string;
};

export const recipientsColumns = (
  setOpendetachPopup: (value: boolean) => void,
  setRecipientToDetachId: (id: string | number) => void
): ColumnDef<Recipient>[] => {
  const menu = (recipientId: string | number) => {
    return [
      {
        label: "View Details",
        icon: <ViewDetailsIcon />,
        link: ROUTES.RECIPIENTS.DETAILS(recipientId),
      },
      {
        label: "Delete",
        icon: <SendMoneyIcon />,
        onClick: () => {
          setOpendetachPopup?.(true);
          setRecipientToDetachId(recipientId);
        },
      },
    ];
  };

  return useMemo(
    () => [
      {
        accessorKey: "reference_number",
        header: "Recipient no.",
      },
      {
        accessorKey: "first_name",
        header: "First Name",
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
      },

      {
        accessorKey: "phone_number",
        header: "Recipient Phone No.",
      },
      {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => {
          const recipient: any = row.original;
          return (
            <div className="capitalize">{recipient?.address?.city?.name}</div>
          );
        },
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => {
          const recipient: any = row.original;
          return (
            <div className="capitalize">
              {recipient?.address?.country?.name}
            </div>
          );
        },
      },
      {
        accessorKey: "remittance_methods",
        header: "Rem. Methods",
        cell: ({ row }) => {
          const remittance_methods: any[] = row.getValue("remittance_methods");

          return (
            <div className="flex flex-wrap">
              {remittance_methods?.map((rm: any, index: number) => (
                <div key={index}>
                  {index !== 0 && ", "}
                  {rm?.remittance_method?.name}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "number_transactions",
        header: "Transfer",
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const recipient = row.original;
          return (
            <DropdownMenuOptions
              menu={menu(recipient.id)}
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
    [setOpendetachPopup]
  );
};
