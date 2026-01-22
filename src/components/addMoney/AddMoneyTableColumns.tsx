import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
import StatusLabel from '@/components/shared/StatusLabel';
// import DropdownMenuOptions from "@/components/shared/DropdownMenu";
// import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
// import EditIcon from "@/assets/icons/edit.svg?react";
// import { ROUTES } from "@/constants/routes";
import { ADD_MONEY_TRANSACTIONS_STATUS_COLORS } from '@/constants/appConstants';

export const AddMoneyTableColumns = (): ColumnDef<any>[] => {
  return useMemo(
    () => [
      {
        accessorKey: 'extra_transaction',
        header: 'Transaction Number',
        cell: ({ row }) => {
          //const extra_transaction: any = row.getValue("extra_transaction");
          return <div>{row.original?.reference_number}</div>;
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
      },
      {
        accessorKey: 'currency',
        header: 'Currency',
        cell: ({ row }) => {
          const currency: string = row.original?.payment?.currency ?? '';
          return <div>{currency}</div>;
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
      },
      {
        accessorKey: 'payment',
        header: 'Payment Method',
        cell: ({ row }) => {
          const payment: any = row.getValue('payment');
          return <div>{payment?.provider}</div>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const value: string = row.original?.payment?.status;
          const color =
            ADD_MONEY_TRANSACTIONS_STATUS_COLORS[
              value as keyof typeof ADD_MONEY_TRANSACTIONS_STATUS_COLORS
            ] || '#000000';
          return <StatusLabel value={value} color={color} />;
        },
      },
    ],
    [],
  );
};
