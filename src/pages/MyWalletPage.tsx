import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet, useDeleteCurrency } from "@/hooks/data/useWallet";
import { CurrencyCard } from "@/components/CurrencyCard";
import { ExtraTransactionsTable } from "@/components/wallet/TransactionsTable";
import ExchangeCurrenciesDialog from "@/components/wallet/ExchangeCurrenciesDialog";
import AddCurrencyDialog from "@/components/wallet/AddCurrencyDialog";
import Loader from "@/components/shared/Loader";

const MyWalletPage: React.FC = () => {
  const [t] = useTranslation("global");

  // For now, we'll use a placeholder agent ID. In a real app, this would come from auth context
  const agentId = 2; // This should come from your auth context/state

  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [isAddCurrencyDialogOpen, setIsAddCurrencyDialogOpen] = useState(false);

  const { data: wallet, isLoading, error } = useWallet(agentId);
  const deleteCurrencyMutation = useDeleteCurrency();

  const handleDeleteCurrency = (currencyId: number) => {
    if (
      wallet &&
      window.confirm(t("modules.pages.wallet.messages.deleteConfirm"))
    ) {
      deleteCurrencyMutation.mutate({
        walletId: wallet.id,
        currencyId: currencyId,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {t("modules.pages.wallet.title")}
          </h1>
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              {t("modules.pages.wallet.buttons.exchangeCurrencies")}
            </button>
            <button
              onClick={() => setIsAddCurrencyDialogOpen(true)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              {t("modules.pages.wallet.buttons.addCurrency")}
            </button>
          </div>
        </div>
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          {t("modules.pages.wallet.title")}
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {t("modules.pages.wallet.messages.errorLoading")} {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {t("modules.pages.wallet.title")}
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsExchangeDialogOpen(true)}
            className="px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors"
            disabled={
              !wallet?.wallet_currencies ||
              wallet.wallet_currencies.length === 0
            }
          >
            {t("modules.pages.wallet.buttons.exchangeCurrencies")}
          </button>{" "}
          <button
            onClick={() => setIsAddCurrencyDialogOpen(true)}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            {t("modules.pages.wallet.buttons.addCurrency")}
          </button>
        </div>
      </div>

      {/* Currency Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-0">
        {wallet?.wallet_currencies?.map((walletCurrency) => (
          <CurrencyCard
            key={walletCurrency.id}
            walletCurrency={walletCurrency}
            onDelete={handleDeleteCurrency}
          />
        ))}
      </div>

      {/* Empty State */}
      {(!wallet?.wallet_currencies ||
        wallet.wallet_currencies.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <p>{t("modules.pages.wallet.messages.noCurrencies")}</p>
          <p className="text-sm">
            {t("modules.pages.wallet.messages.noCurrenciesSubtext")}
          </p>
        </div>
      )}

      {/* Extra Transactions Table */}
      <div className="mt-8">
        <ExtraTransactionsTable />
      </div>

      {/* Exchange Currencies Dialog */}
      <ExchangeCurrenciesDialog
        isOpen={isExchangeDialogOpen}
        onOpenChange={setIsExchangeDialogOpen}
        walletCurrencies={wallet?.wallet_currencies || []}
      />

      {/* Add Currency Dialog */}
      <AddCurrencyDialog
        walletId={wallet?.id || 0}
        walletCurrencies={wallet?.wallet_currencies || []}
        isOpen={isAddCurrencyDialogOpen}
        onOpenChange={setIsAddCurrencyDialogOpen}
      />
    </div>
  );
};

export default MyWalletPage;
