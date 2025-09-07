import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/shared/StatusLabel";
import DropdownMenuOptions from "@/components/shared/DropdownMenu";
// import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
// import EditIcon from "@/assets/icons/edit.svg?react";
// import { ROUTES } from "@/constants/routes";
import { CUSTOMER_STATUS_COLORS } from "@/constants/appConstants";

const menu = () => {
  return [
    {
      label: "View Request",
      // icon: <SendMoneyIcon />,
      onClick: () => {},
    },
    {
      label: "Report issue",
      // icon: <ViewDetailsIcon />,
      onClick: () => {},
    },
    {
      label: "Edit",
      // icon: <ViewDetailsIcon />,
      onClick: () => {},
    },
  ];
};

export const MoneyWithdrawalsTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "",
        header: "Request number",
      },

      {
        accessorKey: "",
        header: "Date",
      },
      {
        accessorKey: "",
        header: "Type",
      },
      {
        accessorKey: "",
        header: "Recipient",
      },
      {
        accessorKey: "",
        header: "Amount",
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
          // const rowww = row.original;
          console.log(row);
          return (
            <DropdownMenuOptions
              menu={menu()}
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
