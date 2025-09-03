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
  exchangeRate?: number;
  feesAndCharges?: number;
  commission?: number;
  extraFees?: number;
  recipientGets?: number;
  totalPayableAmount?: number;
}

interface SummaryCardProps {
  data: SummaryData;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data, className = "" }) => {
  return (
    <div
      className={`bg-[#E4F2F2] rounded-lg border p-6 space-y-4 sticky top-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
      <hr />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Sending Customer</span>
          <span className="font-medium">
            {data?.sendingCustomer} ({data?.sendingCountryIso})
          </span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Recipient</span>
          <span className="font-medium">
            {data?.recipient} ({data?.recipientCountryIso})
          </span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Remittance Method</span>
          <span className="font-medium flex items-center">
            {data?.remittanceMethod}
            <Info className="w-3 h-3 ml-1 text-gray-400" />
          </span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Sending Country</span>
          <span className="font-medium">{data?.sendingCountry}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Receiver Country</span>
          <span className="font-medium">{data?.receivingCountry}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Sending Amount</span>
          <span className="font-medium">{data?.sendingAmount}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Exchange Rate</span>
          <span className="font-medium">{data?.exchangeRate}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Fees and Charges</span>
          <span className="font-medium">{data?.feesAndCharges}</span>
        </div>

        <hr className="my-3" />
        <div className="flex justify-between">
          <span className="text-gray-600">Commission</span>
          <span className="font-medium">{data?.commission}</span>
        </div>

        <hr className="my-3" />
        <div className="flex justify-between">
          <span className="text-gray-600">Extra Fees</span>
          <span className="font-medium">{data?.extraFees}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <span className="text-gray-600">Recipient Gets</span>
          <span className="font-medium">{data?.recipientGets}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-base font-semibold text-teal-600">
          <span>Total Payable Amount</span>
          <span>{data?.totalPayableAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
