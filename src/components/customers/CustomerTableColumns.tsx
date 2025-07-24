import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/StatusLabel";
import DropdownMenuOptions from "@/components/DropdownMenu";
import SendMoneyIcon from "@/assets/icons/send-money.svg?react";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import { ROUTES } from "@/constants/routes";
import { CUSTOMER_STATUS_COLORS } from "@/constants/appConstants";

export type Customer = {
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

const menu = (customerId: string | number) => {
  return [
    {
      label: "Send Money",
      icon: <SendMoneyIcon />,
      onClick: () => {},
    },
    {
      label: "View Details",
      icon: <ViewDetailsIcon />,
      onClick: () => {},
    },
    {
      label: "Edit Customer",
      icon: <EditIcon />,
      onClick: () => {},
      link: ROUTES.CUSTOMERS.EDIT(customerId),
    },
  ];
};

export const useCustomerColumns = (): ColumnDef<Customer>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "reference_number",
        header: "Customer no.",
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
        accessorKey: "transactions",
        header: "Transactions",
      },
      {
        accessorKey: "recipients",
        header: "Recipients",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.getValue("status");
          const color = CUSTOMER_STATUS_COLORS[value as keyof typeof CUSTOMER_STATUS_COLORS] || "#000000";
          return <StatusLabel value={value} color={color} />;
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <DropdownMenuOptions
              menu={menu(customer.id)}
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
