import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/shared/StatusLabel";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import SendMoneyIcon from "@/assets/icons/send-money.svg?react";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
import { ROUTES } from "@/constants/routes";
import { CUSTOMER_STATUS_COLORS } from "@/constants/appConstants";
import type { CustomerType } from "@/types/customers";
import ActionButton from "../shared/ActionButton";

const menu = (customerId: string | number) => {
  return [
    {
      label: "Send Money",
      icon: <SendMoneyIcon />,
      link: ROUTES.SEND_REMITTANCE.CREATE(`?customer=${customerId}`),
    },
    {
      label: "View Details",
      icon: <ViewDetailsIcon />,
      link: ROUTES.CUSTOMERS.DETAILS(customerId),
    },
  ];
};

export const customerColumns = (): ColumnDef<CustomerType>[] => {
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
        accessorKey: "recipient_count",
        header: "Recipients",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.getValue("status");
          const color =
            CUSTOMER_STATUS_COLORS[
              value as keyof typeof CUSTOMER_STATUS_COLORS
            ] || "#000000";
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
const handleAddCustomerToAgent = (customerId: number | string) => {
  console.log(" customerId = ", customerId);
};
export const searchCustomerColumns = (): ColumnDef<CustomerType>[] => {
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
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "phone_number",
        header: "Mobile Number",
        cell: ({ row }) => {
          return (
            <div className="capitalize">
              +{row.original?.country_phone_code} {row.original.phone_number}
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const customer = row.original;
          // console.log(" cussttt ", customer);
          // if (customer?.belongs_to_current_agent) {
          //   return null;
          // }
          return (
            <ActionButton
              type="link"
              title="Add customer"
              onClick={() => handleAddCustomerToAgent(customer?.id)}
            />
          );
        },
      },
    ],
    []
  );
};
