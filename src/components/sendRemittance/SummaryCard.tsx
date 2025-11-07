import React from "react";
import { Info } from "lucide-react";

export interface SummaryData {
  sendingCustomer?: string;
  sendingCountryIso?: string;
  recipient?: string;
  recipientCountryIso?: string;
  remittanceMethod?: string;
  sendingCountry?: string;
  receivingCountry?: string;
  sendingAmount?: number;
  exchangeRate?: number | string;
  feesAndCharges?: number;
  commission?: number;
  extraFees?: number | string;
  recipientGets?: number | string;
  totalPayableAmount?: number;
}

interface SummaryCardProps {
  data: SummaryData;
  className?: string;
}

/**
 * Helper function to format currency values
 */
const formatCurrency = (value: number | undefined, currency?: string): string => {
  if (value === undefined || value === null) return '—';
  return `${value.toFixed(2)}${currency ? ` ${currency}` : ''}`;
};

/**
 * Helper component for summary row
 */
const SummaryRow: React.FC<{
  label: string;
  value: string | number | undefined;
  showInfo?: boolean;
  className?: string;
}> = ({ label, value, showInfo = false, className = "" }) => (
  <>
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-gray-600">{label}</span>
      <span className="font-medium flex items-center gap-1">
        {value || '—'}
        {showInfo && <Info className="w-3 h-3 text-gray-400" />}
      </span>
    </div>
    <hr className="my-3" />
  </>
);

const SummaryCard: React.FC<SummaryCardProps> = ({ data, className = "" }) => {
  return (
    <div
      className={`bg-[#E4F2F2] rounded-lg border p-6 space-y-4 sticky top-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
      <hr />

      <div className="space-y-3 text-sm">
        <SummaryRow
          label="Sending Customer"
          value={
            data.sendingCustomer && data.sendingCountryIso
              ? `${data.sendingCustomer} (${data.sendingCountryIso})`
              : data.sendingCustomer
          }
        />

        <SummaryRow
          label="Recipient"
          value={
            data.recipient && data.recipientCountryIso
              ? `${data.recipient} (${data.recipientCountryIso})`
              : data.recipient
          }
        />

        <SummaryRow
          label="Remittance Method"
          value={data.remittanceMethod}
          showInfo
        />

        <SummaryRow
          label="Sending Country"
          value={data.sendingCountry}
        />

        <SummaryRow
          label="Receiver Country"
          value={data.receivingCountry}
        />

        <SummaryRow
          label="Sending Amount"
          value={data.sendingAmount !== undefined ? formatCurrency(data.sendingAmount) : undefined}
        />

        <SummaryRow
          label="Exchange Rate"
          value={data.exchangeRate}
        />

        <SummaryRow
          label="Fees and Charges"
          value={data.feesAndCharges !== undefined ? formatCurrency(data.feesAndCharges) : undefined}
        />

        <SummaryRow
          label="Commission"
          value={data.commission !== undefined ? formatCurrency(data.commission) : undefined}
        />

        <SummaryRow
          label="Extra Fees"
          value={
            data.extraFees !== undefined
              ? typeof data.extraFees === 'string'
                ? data.extraFees
                : formatCurrency(data.extraFees)
              : undefined
          }
        />

        <SummaryRow
          label="Recipient Gets"
          value={data.recipientGets}
        />

        {/* Total Payable Amount - No trailing hr */}
        <div className="flex justify-between text-base font-semibold text-teal-600 pt-2">
          <span>Total Payable Amount</span>
          <span>
            {data.totalPayableAmount !== undefined
              ? formatCurrency(data.totalPayableAmount)
              : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
