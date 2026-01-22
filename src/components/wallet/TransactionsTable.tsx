import { DataTable } from '@/components/shared/DataTable';
import { ExportButton } from '@/components/shared/ExportButton';
import StatusLabel from '@/components/shared/StatusLabel';
import TransactionFilters from '@/components/wallet/TransactionFilters';
import { useTransactionFilters } from '@/hooks/data/useTransactionFilters';
import { useWalletTransactions } from '@/hooks/data/useTransactions';
import type {
  WalletTransaction,
  WalletTransactionType,
} from '@/types/transactions';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import React from 'react';

// Helper to format transaction type label
const getTransactionTypeLabel = (type: WalletTransactionType): string => {
  const labels: Record<WalletTransactionType, string> = {
    add_money: 'Add Money',
    exchange: 'Exchange',
    commission: 'Commission',
    extra_fee: 'Extra Fee',
    remittance_payment: 'Remittance Payment',
    withdrawal: 'Withdrawal',
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
  };
  return colors[type] || '#6B7280';
};

export const ExtraTransactionsTable: React.FC = () => {
  const {
    filters,
    filtersString,
    updateType,
    updateStatus,
    updateCurrency,
    updateDateRange,
    resetFilters,
    applyFilters,
  } = useTransactionFilters();

  const {
    data: walletTransactions,
    isLoading,
    error,
  } = useWalletTransactions(filtersString);

  const exportOptions = [
    { label: 'Export as CSV', onClick: () => console.log('Export CSV') },
    { label: 'Export as PDF', onClick: () => console.log('Export PDF') },
  ];

  const columns = [
    {
      header: 'Reference',
      accessorKey: 'reference_number',
      cell: ({ row }: { row: { original: WalletTransaction } }) => (
        <span className='font-medium text-gray-900 font-mono text-sm'>
          {row.original.reference_number}
        </span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'created_at',
      cell: ({ row }: { row: { original: WalletTransaction } }) => (
        <span className='text-gray-600 text-sm'>
          {new Date(row.original.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'transaction_type',
      cell: ({ row }: { row: { original: WalletTransaction } }) => (
        <StatusLabel
          value={getTransactionTypeLabel(row.original.transaction_type)}
          color={getTypeColor(row.original.transaction_type)}
        />
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }: { row: { original: WalletTransaction } }) => {
        const isIn = row.original.direction === 'credit';
        return (
          <div className='flex items-center gap-1'>
            {isIn ? (
              <ArrowUpRight className='w-4 h-4 text-green-500' />
            ) : (
              <ArrowDownLeft className='w-4 h-4 text-red-500' />
            )}
            <span
              className={`font-medium ${isIn ? 'text-green-600' : 'text-red-600'}`}
            >
              {isIn ? '+' : '-'}
              {row.original.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className='text-gray-500 text-sm ml-1'>
              {row.original.currency_code}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Balance',
      accessorKey: 'balance_after',
      cell: ({ row }: { row: { original: WalletTransaction } }) => (
        <div className='text-sm'>
          <div className='text-gray-900 font-medium'>
            {row.original.balance_after.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            {row.original.currency_code}
          </div>
          <div className='text-gray-400 text-xs'>
            was{' '}
            {row.original.balance_before.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      ),
    },
    {
      header: 'Details',
      accessorKey: 'notes',
      cell: ({ row }: { row: { original: WalletTransaction } }) => {
        const tx = row.original;

        // Exchange transaction details
        if (tx.transaction_type === 'exchange' && tx.exchange) {
          return (
            <div className='text-sm'>
              <div className='text-gray-700'>
                {tx.exchange.from_amount?.toLocaleString()}{' '}
                {tx.exchange.from_currency} →{' '}
                {tx.exchange.to_amount?.toLocaleString()}{' '}
                {tx.exchange.to_currency}
              </div>
              {tx.exchange.rate && (
                <div className='text-gray-400 text-xs'>
                  Rate: {tx.exchange.rate} | Fee: {tx.exchange.fee || 0}
                </div>
              )}
            </div>
          );
        }

        // Commission/Extra fee with source transaction
        if (tx.source_transaction_ref) {
          return (
            <div className='text-sm'>
              <div className='text-gray-700'>{tx.notes || '-'}</div>
              <div className='text-gray-400 text-xs'>
                Source: {tx.source_transaction_ref}
              </div>
            </div>
          );
        }

        return <span className='text-gray-600 text-sm'>{tx.notes || '-'}</span>;
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: () => <StatusLabel value='Completed' color='#10B981' />,
    },
  ];

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-700'>
        Error loading wallet transactions: {error.message}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header with Filter and Export */}
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold text-gray-900'>
          Wallet Transaction History
        </h2>
        <div className='flex space-x-3'>
          {/* Transaction Filters */}
          <TransactionFilters
            filters={filters}
            onUpdateType={updateType}
            onUpdateStatus={updateStatus}
            onUpdateCurrency={updateCurrency}
            onUpdateDateRange={updateDateRange}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
          />
          <ExportButton options={exportOptions} />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={walletTransactions || []}
        columns={columns}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
