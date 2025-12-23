import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
import SendMoneyIcon from "@/assets/icons/send-money.svg?react";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import ActionButton from "../shared/ActionButton";
import LinkList from "../shared/LinkList";

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

const menu = (recipientId: string | number) => {
  return [
    {
      label: "Send Remittance",
      icon: <SendMoneyIcon />,
      onClick: () => {},
      link: ROUTES.SEND_REMITTANCE.CREATE(`?recipient=${recipientId}`),
    },
    {
      label: "View Details",
      icon: <ViewDetailsIcon />,
      link: ROUTES.RECIPIENTS.DETAILS(recipientId),
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
        accessorKey: "phone_number",
        header: "Mobile Number",
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
                      to={ROUTES.CUSTOMERS.DETAILS(customer.id)}
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
    []
  );
};
export const customerRecipientsColumns = (): ColumnDef<Recipient>[] => {
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
        header: "Mobile Number",
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
        accessorKey: "remittance_methods",
        header: "Rem. Methods",
        cell: ({ row }) => {
          const remittance_methods: any[] = row.getValue("remittance_methods");
          const data = remittance_methods?.map((rm) => ({
            label: rm?.remittance_method?.name,
          }));
          return <LinkList data={data} />;
        },
      },
      {
        accessorKey: "number_transactions",
        header: "Transactions",
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
export const recipientsSearchColumns = ({
  attachRecipient,
}: {
  attachRecipient: (recipientId: string | number) => void;
}): ColumnDef<Recipient>[] => {
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
        header: "Mobile Number",
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
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const recipient: any = row.original;
          if (recipient?.attachment_info?.is_attached) {
            return (
              <div className="text-primary font-bold p-2">Already Attached</div>
            );
          }
          return (
            <ActionButton
              title="Add recipient"
              type="link"
              onClick={() => attachRecipient(recipient.id)}
            />
          );
        },
      },
    ],
    [attachRecipient]
  );
};
