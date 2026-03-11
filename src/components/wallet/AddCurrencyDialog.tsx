import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCurrencies } from "@/hooks/data/useCurrency";
import { useAddCurrency } from "@/hooks/data/useWallet";
import type { WalletCurrency } from "@/types/wallet";
import CurrencyInput from "@/components/CurrencyInput";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
const addCurrencySchema = z.object({
  currencyId: z.number().min(1, "Please select a currency to add"),
});

type AddCurrencyFormData = z.infer<typeof addCurrencySchema>;

interface AddCurrencyDialogProps {
  walletId: number;
  walletCurrencies: WalletCurrency[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCurrencyDialog: React.FC<AddCurrencyDialogProps> = ({
  walletId,
  walletCurrencies,
  isOpen,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Fetch all available currencies
  const { data: allCurrencies = [], isLoading: currenciesLoading } =
    useCurrencies();
  const addCurrencyMutation = useAddCurrency();

  // Get currencies that are not already in the wallet
  const availableCurrencies = allCurrencies.filter(
    (currency) =>
      !walletCurrencies.some((wc) => wc?.currency?.id === currency?.id),
  );

  const form = useForm<AddCurrencyFormData>({
    resolver: zodResolver(addCurrencySchema),
    defaultValues: {
      currencyId: 0,
    },
  });

  // Use a ref to track whether we've already initialized the form
  const initializedRef = React.useRef(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && availableCurrencies.length > 0 && !initializedRef.current) {
      // Set the first available currency as default
      form.reset({
        currencyId: availableCurrencies[0].id,
      });
      setErrorMessage("");
      setSuccessMessage("");
      initializedRef.current = true;
    } else if (!isOpen) {
      // Reset the ref when dialog closes
      initializedRef.current = false;
    }
  }, [isOpen, form, availableCurrencies]);

  const handleSubmit = async (data: AddCurrencyFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await addCurrencyMutation.mutateAsync({
        walletId: walletId,
        currencyId: data.currencyId,
      });

      setSuccessMessage("Currency added to wallet successfully!");

      // Reset form
      form.reset({
        currencyId: 0,
      });

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "An error occurred while adding currency",
        );
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md  min-w-xs">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Currency to Wallet
          </DialogTitle>
        </DialogHeader>

        {currenciesLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : availableCurrencies.length === 100 ? (
          <div className="text-center py-8 text-gray-500">
            <p>All available currencies are already in your wallet.</p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currencyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CurrencyInput
                          placeholder="Select currency to add"
                          amountPlaceholder="Amount (0 by default)"
                          currencyOptions={availableCurrencies?.map(
                            (currency) => ({
                              id: currency?.id,
                              code: currency?.code,
                              name: currency?.name,
                            }),
                          )}
                          selectedCurrencyId={field.value || undefined}
                          amount={0}
                          onCurrencyChange={(currencyId) =>
                            field.onChange(currencyId)
                          }
                          onAmountChange={() => {}} // Amount not needed for adding currency
                          readOnly={true} // Make the amount field read-only but not the currency selector
                          disabled={false} // Don't disable the component
                          error={form.formState.errors.currencyId?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  disabled={isSubmitting || !form.watch("currencyId")}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium"
                >
                  {isSubmitting ? "Adding..." : "ADD CURRENCY"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="border-2 border-cyan-500 text-cyan-500 px-8 py-3 rounded-lg font-medium hover:bg-cyan-50"
                >
                  CANCEL
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCurrencyDialog;
