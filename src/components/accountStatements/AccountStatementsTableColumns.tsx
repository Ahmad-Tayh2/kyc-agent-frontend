import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
import StatusLabel from '@/components/shared/StatusLabel';
// import DropdownMenuOptions from "@/components/shared/DropdownMenu";
// import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
// import EditIcon from "@/assets/icons/edit.svg?react";
// import { ROUTES } from "@/constants/routes";
import { TRASACTIONS_STATUSES_COLORS } from '@/constants/appConstants';
import type { WalletTransactionType } from '@/types/transactions';

export const AccountStatementsTableColumns = (): ColumnDef<any>[] => {
  // Helper to format transaction type label
  const getTransactionTypeLabel = (type: WalletTransactionType): string => {
    const labels: Record<WalletTransactionType, string> = {
      add_money: 'Add Money',
      exchange: 'Exchange',
      commission: 'Commission',
      extra_fee: 'Extra Fee',
      remittance_payment: 'Remittance Payment',
      withdrawal: 'Withdrawal',
      transaction_payment: 'Transaction Payment',
    };
    return labels[type] || type;
  };

  // Helper to get type color
  const getTypeColor = (type: WalletTransactionType): string => {
    const colors: Record<WalletTransactionType, string> = {
      add_money: '#10B981', // Green
      exchange: '#8B5CF6', // Purple
      commission: '#F59E0B', // Amber
      extra_fee: '#EF4444', // Red
      remittance_payment: '#3B82F6', // Blue
      withdrawal: '#6B7280', // Gray
      transaction_payment: '#06B6D4', // Cyan
    };
    return colors[type] || '#6B7280';
  };

  return useMemo(
    () => [
      {
        accessorKey: 'transaction_reference',
        header: 'Tr. #',
        cell: ({ row }) => {
          const transaction_reference: string = row.getValue(
            'transaction_reference',
          );

          return <div className='capitalize'>{transaction_reference}</div>;
        },
      },

      {
        accessorKey: 'transaction_date',
        header: 'Date',
      },
      {
        header: 'Type',
        accessorKey: 'extra_transaction_type',
        cell: ({
          row,
        }: {
          row: { original: { extra_transaction_type: WalletTransactionType } };
        }) => (
          <StatusLabel
            value={getTransactionTypeLabel(row.original.extra_transaction_type)}
            color={getTypeColor(row.original.extra_transaction_type)}
          />
        ),
      },
      {
        accessorKey: 'comment',
        header: 'Comment',
      },
      {
        accessorKey: 'debit',
        header: 'Debit',
        cell: ({ row }) => {
          const currency = row.original.currency;
          const debit = row.original.debit;
          return (
            <div>
              {debit === 0 ? '-' : debit} {debit === 0 ? '' : currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'credit',
        header: 'Credit',
        cell: ({ row }) => {
          const currency = row.original.currency;
          const credit = row.original.credit;
          return (
            <div>
              {credit === 0 ? '-' : credit} {credit === 0 ? '' : currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'wallet_balance_before',
        header: 'Balance Before',
        cell: ({ row }) => {
          const currency = row.original.currency;
          const wallet_balance_before = row.original.wallet_balance_before;
          return (
            <div>
              {wallet_balance_before} {currency}
            </div>
          );
        },
      },
      {
        accessorKey: 'wallet_balance_after',
        header: 'Balance After',
        cell: ({ row }) => {
          const currency = row.original.currency;
          const wallet_balance_after = row.original.wallet_balance_after;
          return (
            <div>
              {wallet_balance_after} {currency}
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
    ],
    [],
  );
};
