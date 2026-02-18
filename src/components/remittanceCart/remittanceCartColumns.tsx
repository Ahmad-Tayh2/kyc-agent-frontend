import DeleteIcon from '@/assets/icons/delete.svg?react';
import EditIcon from '@/assets/icons/edit.svg?react';
import DropdownMenuOptions from '@/components/shared/DropdownMenu';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';

import { ROUTES } from '@/constants/routes';
import { useRemoveTransactionFromCart } from '@/hooks/data/useRemittanceCarts';
import type { CustomerType } from '@/types/customers';

export const remittanceCartColumns = (): ColumnDef<CustomerType>[] => {
  const { mutateAsync: removeTransactionFromCart } =
    useRemoveTransactionFromCart();
  const menu = (transferId: number) => {
    return [
      {
        label: 'Edit',
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
        label: 'Remove From Cart',
        icon: <DeleteIcon />,
        onClick: () => {
          console.log(' start removing');
          removeTransactionFromCart(transferId);
        },
      },
    ];
  };
  return useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Tr. #',
      },
      {
        accessorKey: 'recipient',
        header: 'Recipient',
        cell: ({ row }) => {
          const recipient: any = row.getValue('recipient');

          return (
            <div className='capitalize'>
              {recipient?.first_name + ' ' + recipient?.last_name}
            </div>
          );
        },
      },
      {
        accessorKey: 'send_country',
        header: 'Send Country',
      },
      {
        accessorKey: 'receive_country',
        header: 'Destination Country',
      },
      {
        accessorKey: 'remittance_method',
        header: 'Remittance Method',
        cell: ({ row }) => {
          const method: string = row.getValue('remittance_method');
          return <div className='capitalize'>{method}</div>;
        },
      },
      {
        accessorKey: 'send_amount',
        header: 'Sent Amount',
        cell: ({ row }) => {
          const amount: string = row.getValue('send_amount');
          const currency: string = row.original?.send_currency;
          return (
            <div>
              {amount} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'receive_amount',
        header: 'Received Amount',
        cell: ({ row }) => {
          const amount: string = row.getValue('receive_amount');
          const currency: string = row.original?.receive_currency;
          return (
            <div>
              {amount} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'commission',
        header: 'Comm.',
      },
      {
        accessorKey: 'total_to_pay',
        header: 'Total To Pay',
      },

      {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
          const transfer = row.original;
          return (
            <DropdownMenuOptions
              menu={menu(Number(transfer.id))}
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
