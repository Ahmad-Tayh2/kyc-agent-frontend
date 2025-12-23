import React from "react";
import { useExtraTransactions } from "@/hooks/data/useTransactions";
import { useTransactionFilters } from "@/hooks/data/useTransactionFilters";
import { DataTable } from "@/components/shared/DataTable";
import StatusLabel from "@/components/shared/StatusLabel";
import { ExportButton } from "@/components/shared/ExportButton";
import TransactionFilters from "@/components/wallet/TransactionFilters";
import type { ExtraTransaction, TransactionStatus } from "@/types/transactions";

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
    data: extraTransactions,
    isLoading,
    error,
  } = useExtraTransactions(filtersString);

  const exportOptions = [
    { label: "Export as CSV", onClick: () => console.log("Export CSV") },
    { label: "Export as PDF", onClick: () => console.log("Export PDF") },
  ];

  // Get status color based on status
  const getStatusColor = (status: TransactionStatus): string => {
    switch (status) {
      case "initiated":
        return "#3B82F6"; // Blue
      case "processing":
        return "#F59E0B"; // Amber
      case "completed":
        return "#10B981"; // Green
      case "failed":
        return "#EF4444"; // Red
      case "cancelled":
        return "#6B7280"; // Gray
      default:
        return "#6B7280"; // Gray
    }
  };

  const columns = [
    {
      header: "Transaction Number",
      accessorKey: "reference_number",
      cell: ({ row }: { row: { original: ExtraTransaction } }) => (
        <span className="font-medium text-gray-900">
          {row.original.reference_number}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "initiated_at",
      cell: ({ row }: { row: { original: ExtraTransaction } }) => (
        <span className="text-gray-600">
          {new Date(row.original.initiated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }: { row: { original: ExtraTransaction } }) => {
        const currency = row?.original?.currency;
        return <span title={currency?.name}>{currency?.code}</span>;
      },
    },
    {
      header: "Type",
      accessorKey: "type_label",
      cell: ({ row }: { row: { original: ExtraTransaction } }) => (
        <span className="text-gray-700">{row.original.type_label}</span>
      ),
    },
    {
      header: "Notes",
      accessorKey: "notes",
    },
    {
      header: "Status",
      accessorKey: "status_label",
      cell: ({ row }: { row: { original: ExtraTransaction } }) => (
        <StatusLabel
          value={row.original.status_label}
          color={getStatusColor(row.original.status)}
        />
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading extra transactions: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filter and Export */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Extra Transaction History
        </h2>
        <div className="flex space-x-3">
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
        data={extraTransactions || []}
        columns={columns}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
