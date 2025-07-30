import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import {
  useCurrencies,
  useExchangeMoney,
  useExchangeMoneyPreview,
} from "@/hooks/useCurrency";
import type { WalletCurrency } from "@/types/wallet";
import type { ExchangePreviewPayload } from "@/types/currency";
import { Info } from "lucide-react";
import CurrencyInput from "@/components/CurrencyInput";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

// Form validation schema
const createExchangeSchema = (t: (key: string) => string) =>
  z.object({
    fromCurrencyId: z
      .number()
      .min(1, t("modules.pages.wallet.exchange.validation.selectFromCurrency")),
    toCurrencyId: z
      .number()
      .min(1, t("modules.pages.wallet.exchange.validation.selectToCurrency")),
    fromAmount: z
      .number()
      .min(0.01, t("modules.pages.wallet.exchange.validation.amountRequired")),
    toAmount: z.number().optional(),
  });

type ExchangeFormData = {
  fromCurrencyId: number;
  toCurrencyId: number;
  fromAmount: number;
  toAmount?: number;
};

interface ExchangeCurrenciesDialogProps {
  trigger?: React.ReactNode;
  walletCurrencies: WalletCurrency[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ExchangeCurrenciesDialog: React.FC<ExchangeCurrenciesDialogProps> = ({
  trigger,
  walletCurrencies,
  isOpen,
  onOpenChange,
}) => {
  const [t] = useTranslation("global");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Get QueryClient instance for cache invalidation
  const queryClient = useQueryClient();

  // Fetch all available currencies
  const { data: allCurrencies = [], isLoading: currenciesLoading } =
    useCurrencies();
  const exchangeMutation = useExchangeMoney();

  const exchangeSchema = createExchangeSchema(t);

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      fromCurrencyId: 0,
      toCurrencyId: 0,
      fromAmount: 0,
      toAmount: 0,
    },
  });

  // Set default currencies when data is loaded
  useEffect(() => {
    // Set default fromCurrency (first wallet currency)
    if (walletCurrencies.length > 0 && form.getValues("fromCurrencyId") === 0) {
      form.setValue("fromCurrencyId", walletCurrencies[0].id); // Use WalletCurrency.id instead of currency.id
    }

    // Set default toCurrency (USD or first available currency)
    if (allCurrencies.length > 0 && form.getValues("toCurrencyId") === 0) {
      const usdCurrency = allCurrencies.find((c) => c.code === "USD");
      const defaultToCurrency = usdCurrency || allCurrencies[0];

      // Make sure it's not the same as the fromCurrency
      const fromWalletCurrency = walletCurrencies.find(
        (wc) => wc.id === form.getValues("fromCurrencyId")
      );

      if (
        fromWalletCurrency &&
        defaultToCurrency.id !== fromWalletCurrency.currency.id
      ) {
        form.setValue("toCurrencyId", defaultToCurrency.id);
      } else {
        // If USD is the same as fromCurrency, pick the next available one
        const alternativeCurrency = allCurrencies.find(
          (c) => fromWalletCurrency && c.id !== fromWalletCurrency.currency.id
        );
        if (alternativeCurrency) {
          form.setValue("toCurrencyId", alternativeCurrency.id);
        }
      }
    }
  }, [walletCurrencies, allCurrencies, form]);

  // Reset form to defaults when dialog opens
  useEffect(() => {
    if (isOpen && walletCurrencies.length > 0 && allCurrencies.length > 0) {
      const defaultFromCurrency = walletCurrencies[0].id; // Use WalletCurrency.id
      const fromCurrencyObj = walletCurrencies[0];

      const usdCurrency = allCurrencies.find((c) => c.code === "USD");
      const defaultToCurrency =
        usdCurrency?.id !== fromCurrencyObj.currency.id
          ? usdCurrency?.id || allCurrencies[0].id
          : allCurrencies.find((c) => c.id !== fromCurrencyObj.currency.id)
              ?.id || allCurrencies[0].id;

      form.reset({
        fromCurrencyId: defaultFromCurrency,
        toCurrencyId: defaultToCurrency,
        fromAmount: 0,
        toAmount: 0,
      });
    }
  }, [isOpen, walletCurrencies, allCurrencies, form]);

  const watchedFromCurrency = form.watch("fromCurrencyId");
  const watchedToCurrency = form.watch("toCurrencyId");
  const watchedFromAmount = form.watch("fromAmount");

  // Get the selected currencies for display
  const selectedFromCurrency = walletCurrencies.find(
    (wc) => wc.id === watchedFromCurrency
  );
  const selectedToCurrency = allCurrencies.find(
    (c) => c.id === watchedToCurrency
  );

  // Set up the preview payload when the form values change
  const [previewPayload, setPreviewPayload] = useState<
    ExchangePreviewPayload | undefined
  >();

  useEffect(() => {
    if (
      watchedFromCurrency &&
      watchedToCurrency &&
      watchedFromAmount &&
      watchedFromAmount > 0
    ) {
      setPreviewPayload({
        from_wallet_currency_id: watchedFromCurrency, // This is already the wallet currency ID
        to_currency_id: watchedToCurrency, // This is the target currency ID (not wallet currency ID)
        from_amount: watchedFromAmount,
      });
    } else {
      setPreviewPayload(undefined);
    }
  }, [watchedFromCurrency, watchedToCurrency, watchedFromAmount]);

  // Fetch preview data from API
  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useExchangeMoneyPreview(previewPayload);

  // Prepare conversion info for display
  const conversionInfo = previewData?.exchange_details
    ? {
        rate: previewData.exchange_details.applied_exchange_rate,
        convertedAmount: previewData.exchange_details.to_amount,
        charges: previewData.exchange_details.margin_amount,
        total:
          previewData.exchange_details.to_amount -
          previewData.exchange_details.margin_amount,
      }
    : null;

  const handleSubmit = async (data: ExchangeFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await exchangeMutation.mutateAsync({
        from_wallet_currency_id: data.fromCurrencyId, // This is the wallet currency ID
        to_currency_id: data.toCurrencyId, // This is the target currency ID
        from_amount: data.fromAmount,
      });

      setSuccessMessage(t("modules.pages.wallet.messages.exchangeSuccess"));

      // Reset form with default currencies
      const defaultFromCurrency =
        walletCurrencies.length > 0 ? walletCurrencies[0].id : 0; // Use wallet currency ID
      const fromCurrencyObj = walletCurrencies[0];
      const usdCurrency = allCurrencies.find((c) => c.code === "USD");
      const defaultToCurrency =
        usdCurrency?.id !== (fromCurrencyObj?.currency.id || 0)
          ? usdCurrency?.id ||
            (allCurrencies.length > 0 ? allCurrencies[0].id : 0)
          : allCurrencies.find(
              (c) => fromCurrencyObj && c.id !== fromCurrencyObj.currency.id
            )?.id || 0;

      form.reset({
        fromCurrencyId: defaultFromCurrency,
        toCurrencyId: defaultToCurrency,
        fromAmount: 0,
        toAmount: 0,
      });

      // Invalidate the preview query to make sure it's fresh next time
      queryClient.invalidateQueries({ queryKey: ["exchangePreview"] });

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange?.(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || t("modules.pages.wallet.messages.exchangeError")
        );
      } else {
        setErrorMessage(t("modules.pages.wallet.messages.unexpectedError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {t("modules.pages.wallet.exchange.title")}
        </DialogTitle>
      </DialogHeader>

      {/* Info Message */}
      <div className="bg-gray-100 rounded-lg p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700">
          {t("modules.pages.wallet.exchange.infoMessage")}
        </p>
      </div>

      {currenciesLoading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* From Currency Section - Existing Currencies */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t(
                      "modules.pages.wallet.exchange.sections.existingCurrencies"
                    )}
                  </h3>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="fromCurrencyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CurrencyInput
                            placeholder={t(
                              "modules.pages.wallet.exchange.placeholders.selectFromWallet"
                            )}
                            amountPlaceholder={t(
                              "modules.pages.wallet.exchange.placeholders.enterAmount"
                            )}
                            currencyOptions={walletCurrencies.map((wc) => ({
                              id: wc.id, // Use wallet currency ID
                              code: wc.currency.code,
                              name: wc.currency.name,
                            }))}
                            selectedCurrencyId={field.value || undefined}
                            amount={watchedFromAmount}
                            onCurrencyChange={(currencyId) =>
                              field.onChange(currencyId)
                            }
                            onAmountChange={(amount) => {
                              form.setValue("fromAmount", amount);
                              // Auto-calculate the to amount when from amount changes
                              if (conversionInfo) {
                                form.setValue("toAmount", conversionInfo.total);
                              }
                            }}
                            showBalance={true}
                            availableBalance={
                              selectedFromCurrency
                                ? parseFloat(selectedFromCurrency.amount)
                                : undefined
                            }
                            error={
                              form.formState.errors.fromCurrencyId?.message ||
                              form.formState.errors.fromAmount?.message
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {conversionInfo && selectedToCurrency && (
                    <div className="bg-teal-50 rounded-lg p-4 space-y-2">
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>
                            {t(
                              "modules.pages.wallet.exchange.details.exchangeRate"
                            )}
                          </span>
                          <span>
                            1 {selectedFromCurrency?.currency.code} ={" "}
                            {conversionInfo.rate.toFixed(2)}{" "}
                            {selectedToCurrency.code}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            {t(
                              "modules.pages.wallet.exchange.details.convertedAmount"
                            )}
                          </span>
                          <span>
                            {conversionInfo.convertedAmount.toFixed(2)}{" "}
                            {selectedToCurrency.code}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            {t(
                              "modules.pages.wallet.exchange.details.marginFee"
                            )}
                          </span>
                          <span>
                            -{conversionInfo.charges.toFixed(2)}{" "}
                            {selectedToCurrency.code}
                          </span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold text-teal-600">
                          <span>
                            {t(
                              "modules.pages.wallet.exchange.details.youWillReceive"
                            )}
                          </span>
                          <span>
                            {conversionInfo.total.toFixed(2)}{" "}
                            {selectedToCurrency.code}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {previewLoading && watchedFromAmount > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-center">
                        <Loader size={16} />
                        <span className="ml-2 text-sm text-blue-600">
                          {t("modules.pages.wallet.messages.calculatingRate")}
                        </span>
                      </div>
                    </div>
                  )}
                  {previewError && watchedFromAmount > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-sm text-red-600">
                        {t("modules.pages.wallet.messages.unableToCalculate")}
                      </div>
                    </div>
                  )}
                  {previewData && !previewData.sufficient_balance && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-sm text-red-600">
                        {t(
                          "modules.pages.wallet.messages.insufficientBalance",
                          {
                            amount: previewData.from_currency.available_amount,
                            code: previewData.from_currency.code,
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* To Currency Section - All Currencies */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("modules.pages.wallet.exchange.sections.allCurrencies")}
                  </h3>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="toCurrencyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CurrencyInput
                            placeholder={t(
                              "modules.pages.wallet.exchange.placeholders.selectTarget"
                            )}
                            amountPlaceholder={t(
                              "modules.pages.wallet.exchange.placeholders.amountReceive"
                            )}
                            currencyOptions={allCurrencies
                              .filter((currency) => {
                                // Find the selected wallet currency
                                const fromWalletCurrency =
                                  walletCurrencies.find(
                                    (wc) => wc.id === watchedFromCurrency
                                  );
                                // Filter out the currency that's already selected in the "from" dropdown
                                return fromWalletCurrency
                                  ? currency.id !==
                                      fromWalletCurrency.currency.id
                                  : true;
                              })
                              .map((currency) => ({
                                id: currency.id,
                                code: currency.code,
                                name: currency.name,
                              }))}
                            selectedCurrencyId={field.value || undefined}
                            amount={conversionInfo ? conversionInfo.total : 0}
                            onCurrencyChange={(currencyId) =>
                              field.onChange(currencyId)
                            }
                            onAmountChange={() => {}} // Read-only for "to" currency
                            readOnly={true}
                            error={form.formState.errors.toCurrencyId?.message}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                {successMessage}
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !conversionInfo ||
                  previewLoading ||
                  !!previewError ||
                  (previewData && !previewData.sufficient_balance)
                }
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium"
              >
                {isSubmitting
                  ? t("modules.pages.wallet.buttons.processing")
                  : t("modules.pages.wallet.buttons.confirm")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={isSubmitting}
                className="border-2 border-teal-500 text-teal-500 px-8 py-3 rounded-lg font-medium hover:bg-teal-50"
              >
                {t("modules.pages.wallet.buttons.cancel")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {dialogContent}
    </Dialog>
  );
};

export default ExchangeCurrenciesDialog;
