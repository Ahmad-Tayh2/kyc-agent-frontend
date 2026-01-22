// import { useMemo } from "react";
import { DataTable } from '@/components/shared/DataTable';
import { useTranslation } from 'react-i18next';
// import { useGetCommission } from "@/hooks/data/useCommission";
import CommissionFilters from '@/components/commission/CommissionFilters';
import { CommissionTableColumns } from '@/components/commission/CommissionTableColumns';
import PageTitle from '@/components/shared/PageTitle';
import { useGetCommissionEarned } from '@/hooks/data/useFinancialReport';
import { useMemo } from 'react';
// import ReportIssueDialog from "@/components/commission/ReportIssueDialog";
import { useCommissionFilters } from '@/hooks/data/useCommissionFilters';
// import { ROUTES } from "@/constants/routes";
import { AlertCircle } from 'lucide-react';

const MoneyWithdrawalsPage: React.FC = () => {
  const [t] = useTranslation('global');
  const columns = CommissionTableColumns();

  const {
    filters,
    filtersString,
    updateSearchTerm,

    updateTransactionStatus,
    updateDateRange,
    updateSendingCountry,
    updateReceivedCountry,

    resetFilters,
    applyFilters,
    updatePagination,
  } = useCommissionFilters();

  const {
    data: response,
    isLoading,
    error,
  } = useGetCommissionEarned(filtersString);

  // Memoize customers data to prevent unnecessary re-renders
  const commissionData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  const commissionMeta = useMemo(() => {
    return response?.meta || [];
  }, [response?.meta]);

  const pagination = {
    enable: true,
    page: commissionMeta?.current_page,
    per_page: commissionMeta?.per_page,
    total: commissionMeta?.total,
    from: commissionMeta?.from,
    to: commissionMeta?.to,
    last_page: commissionMeta?.last_page,
    onChangeRowsPerPage: (value: number) => {
      updatePagination({ per_page: value });
    },
    setPage: (value: number) => {
      updatePagination({ page: value });
    },
  };
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <PageTitle title={t('modules.pages.commissionEarned.title')} />
      </div>
      <div className='bg-orange-50 border-2 border-orange-300 rounded-lg p-3 flex items-start space-x-2'>
        <AlertCircle className='w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5' />
        <p className='text-sm font-semibold text-orange-800'>
          Important: Only completed transactions are included in the Wallet
          Balance
        </p>
      </div>
      <CommissionFilters
        filters={filters}
        onUpdateSearchTerm={updateSearchTerm}
        onUpdateTransactionStatus={updateTransactionStatus}
        onUpdateDateRange={updateDateRange}
        onUpdateSendingCountry={updateSendingCountry}
        onUpdateReceivedCountry={updateReceivedCountry}
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      />

      <div>
        {/* <ReportIssueDialog trigger={<div>Report issue popup</div>} /> */}
        <DataTable
          data={commissionData}
          columns={columns}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default MoneyWithdrawalsPage;
