import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import SendMoneyIcon from "@/assets/icons/send-money.svg?react";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

export type Recipient = {
  id: string;
  reference_number: string;
  first_name: string;
  last_name: string;
  country: {
    name: string;
  };
  phone_number: string;
  created_at: string;
  status: string;
};

const menu = (recipientId: string | number) => {
  return [
    {
      label: "Send Remittance",
      icon: <SendMoneyIcon />,
      onClick: () => {},
      link: ROUTES.SEND_REMITTANCE.CREATE(`?recipient=${recipientId}`),
    },
    {
      label: "Edit Recipient",
      icon: <EditIcon />,
      onClick: () => {},
      link: ROUTES.RECIPIENTS.EDIT(recipientId),
    },
    {
      label: "View Recipient",
      icon: <ViewDetailsIcon />,
      onClick: () => {},
    },
  ];
};

export const recipientsColumns = (): ColumnDef<Recipient>[] => {
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
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => {
          const country: {
            name: string;
          } = row.getValue("country");

          return <div className="capitalize">{country?.name}</div>;
        },
      },
      {
        accessorKey: "phone_number",
        header: "Mobile Number",
      },
      {
        accessorKey: "created_at",
        header: "Reg. date",
        cell: ({ row }) => {
          const value: string = row.getValue("created_at");
          const date = parseISO(value);
          const formattedDate = format(date, "dd-MM-yyyy");
          return formattedDate;
        },
      },
      {
        accessorKey: "customers",
        header: "Customers",
        cell: ({ row }) => {
          const customers: { full_name: string; id: number }[] =
            row.getValue("customers");

          return (
            <div className="flex flex-wrap">
              {customers?.map(
                (
                  customer: { full_name: string; id: number },
                  index: number
                ) => (
                  <div key={customer.id}>
                    {index !== 0 && ", "}
                    <Link
                      to={ROUTES.CUSTOMERS.EDIT(customer.id)}
                      className="hover:underline"
                    >
                      {customer.full_name}
                    </Link>
                  </div>
                )
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "remittance",
        header: "Rem. Methods",
      },
      {
        accessorKey: "transfer",
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
    []
  );
};
