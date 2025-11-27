import React from "react";
import type { WalletCurrency } from "@/types/wallet";
//import DeleteIcon from '@/assets/icons/delete.svg';

interface CurrencyCardProps {
  walletCurrency: WalletCurrency;
  onDelete: (currencyId: number) => void;
}

export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  walletCurrency,
  //onDelete,
}) => {
  const { currency, amount } = walletCurrency;

  // Format the amount to show proper decimal places
  const formattedAmount = parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between shadow-sm hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      {/* Left Column: Currency Icon, Code, and Amount */}
      <div className="flex flex-col items-start space-y-3">
        {/* Currency Icon */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(24, 172, 172, 0.57)" }}
        >
          <span className="text-2xl font-bold" style={{ color: "#18ACAC" }}>
            {currency?.symbol}
          </span>
        </div>

        {/* Currency Code */}
        <div className="text-base font-semibold text-gray-700">
          {currency?.code}
        </div>

        {/* Amount */}
        <div className="text-2xl font-bold text-gray-900">
          {formattedAmount}
        </div>
      </div>

      {/* Right Column: Delete Button */}
      {/* <div className='flex-col'>
        <button
          onClick={() => onDelete(currency.id)}
          className='p-2 text-gray-400 hover:text-red-500 transition-all duration-200 '
          title={`Delete ${currency.code}`}
        >
          <img
            src={DeleteIcon}
            alt='Delete'
            className='w-8 h-8 hover:text-red-500 cursor-pointer'
          />
        </button>
      </div> */}
    </div>
  );
};

export default CurrencyCard;
