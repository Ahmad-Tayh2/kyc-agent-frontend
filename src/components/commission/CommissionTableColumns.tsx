import ViewDetailsIcon from '@/assets/icons/view-details.svg?react';
import DropdownMenuOptions from '@/components/shared/DropdownMenu';
import StatusLabel from '@/components/shared/StatusLabel';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';
// import EditIcon from "@/assets/icons/edit.svg?react";
// import { ROUTES } from "@/constants/routes";
import { TRASACTIONS_STATUSES_COLORS } from '@/constants/appConstants';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

const menu = (transferRef: string) => {
  return [
    // {
    //   label: "Report Issue",
    //   // icon: <SendMoneyIcon />,
    //   onClick: () => {},
    // },
    {
      label: 'View Transaction',
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
        accessorKey: 'transaction_reference',
        header: 'Tr. #',
        cell: ({ row }) => {
          const transaction_reference: string = row.getValue(
            'transaction_reference',
          );

          return (
            <div className='capitalize'>
              <Link
                to={ROUTES.SEND_REMITTANCE.EDIT(transaction_reference)}
                className='font-medium text-xs hover:underline'
              >
                {transaction_reference}
              </Link>
            </div>
          );
        },
      },

      {
        accessorKey: 'transaction_date',
        header: 'Sending Date',
      },
      {
        accessorKey: 'sender_name',
        header: 'Sender',
      },
      {
        accessorKey: 'receiver_name',
        header: 'Recipient Full Name',
      },
      {
        accessorKey: 'send_amount',
        header: 'Sent Amount',
        cell: ({ row }) => {
          const currency = row.original.send_currency;
          const send_amount = row.original.send_amount;
          return (
            <div>
              {send_amount} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'receive_amount',
        header: 'Received Amount',
        cell: ({ row }) => {
          const currency = row.original.receive_currency;
          const receive_amount = row.original.receive_amount;
          return (
            <div>
              {receive_amount} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'comm', //TODO: to verify what to display here
        header: 'Comm.',
        cell: ({ row }) => {
          const currency = row.original.default_currency;
          const comm = row.original.send_agent_commission;
          return (
            <div>
              {comm} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'extra_fees',
        header: 'Extra Fees',
        cell: ({ row }) => {
          const currency = row.original.default_currency;
          const extra_fees = row.original.extra_fees;
          return (
            <div>
              {extra_fees} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'total_commission',
        header: 'Total Comm.',
        cell: ({ row }) => {
          const currency = row.original.default_currency;
          const total_commission = row.original.total_commission;
          return (
            <div>
              {total_commission} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'transaction_status',
        header: 'Status',
        cell: ({ row }) => {
          const value: string = row.getValue('transaction_status');
          const color =
            TRASACTIONS_STATUSES_COLORS[
              value as keyof typeof TRASACTIONS_STATUSES_COLORS
            ] || '#000000';
          return <StatusLabel value={value} color={color} />;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
          const transferRef = row.original?.transaction_reference;
          return (
            <DropdownMenuOptions
              menu={menu(transferRef)}
              trigger={
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <MoreHorizontal />
                </Button>
              }
            />
          );
        },
      },
    ],
    [],
  );
};
