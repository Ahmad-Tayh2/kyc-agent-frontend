import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import { Input } from "@/components/ui/input";
import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import { cn } from "@/lib/utils";
import ActionButton from "@/components/shared/ActionButton";
import CreateBankAccountDialog from "@/components/moneyWithdrawals/CreateBankAccountDialog";

const RequestMoneyWithdrawalsPage = () => {
  const navigate = useNavigate();
  const [withdrawalMethod, setWithdrawalMethod] = useState<"bank" | "cash">(
    "bank"
  );
  const [amount, setAmount] = useState("");
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");

  // Mock data for bank accounts
  const bankAccounts = [
    { label: "Hdfc Bank **** **** **** 8686", value: "hdfc_8686" },
    {
      label: "Central Bank of EUROPE **** **** **** 8686",
      value: "central_8686",
    },
  ];

  // Mock data for recipients
  const recipients = [
    { label: "John Doe - **** **** **** 1234", value: "john_1234" },
    { label: "Jane Smith - **** **** **** 5678", value: "jane_5678" },
  ];

  const handleBack = () => {
    navigate(ROUTES.MONEY_WITHDRAWALS.LIST);
  };

  const handleMethodChange = (method: "bank" | "cash") => {
    setWithdrawalMethod(method);
    // setSelectedBankAccount("");
    // setSelectedRecipient("");
  };

  const handleCancel = () => {
    navigate(ROUTES.MONEY_WITHDRAWALS.LIST);
  };

  const handleRequestWithdrawal = () => {
    // Handle withdrawal request logic here
    console.log({
      method: withdrawalMethod,
      amount,
      bankAccount: selectedBankAccount,
      recipient: selectedRecipient,
    });
  };
  const handleCreateRecipient = () => {
    navigate(ROUTES.RECIPIENTS.CREATE_FORM);
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-start items-center gap-3">
        <button
          onClick={handleBack}
          className="text-primary top-1 cursor-pointer"
        >
          <BackArrowIcon width={30} height={30} />
        </button>
        <PageTitle title={"Request Withdrawal"} />
      </div>

      <div className="bg-white rounded-lg border">
        <div className="space-y-6">
          {/* Withdrawal Method Selection */}
          <div className="space-y-4 border-b-1 border-gray-200 p-5">
            <div className="flex items-center gap-4 ">
              {/* Bank Transfer Option */}
              <button
                type="button"
                onClick={() => handleMethodChange("bank")}
                className={
                  "flex items-center gap-2 px-4 py-3 rounded-lg transition-all"
                }
              >
                {withdrawalMethod === "bank" ? (
                  <CheckedIcon className="w-5 h-5" />
                ) : (
                  <UncheckedIcon className="w-5 h-5" />
                )}
                <span className="font-medium">Bank Transfer</span>
              </button>

              {/* Cash Pickup Option */}
              <button
                type="button"
                onClick={() => handleMethodChange("cash")}
                className={
                  "flex items-center gap-2 px-4 py-3 rounded-lg transition-all"
                }
              >
                {withdrawalMethod === "cash" ? (
                  <CheckedIcon className="w-5 h-5" />
                ) : (
                  <UncheckedIcon className="w-5 h-5" />
                )}
                <span className="font-medium">Cash Pickup</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex items-center">
            <div
              className={cn(
                "p-5",
                withdrawalMethod === "cash" ? " w-1/2" : "w-full"
              )}
            >
              <label className="text-sm font-medium text-gray-700">
                Enter Amount
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary font-semibold">
                  $
                </div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 h-12 text-lg bg-green-50 border-green-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {withdrawalMethod === "cash" && (
              <div className="p-5 w-1/2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Select your own recipient
                    </label>
                    <ActionButton
                      type="link"
                      className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                      title="CREATE A RECIPIENT"
                      onClick={handleCreateRecipient}
                    />
                  </div>
                  <SingleSelectDropdown
                    options={recipients}
                    selectedValue={selectedRecipient}
                    onValueChange={setSelectedRecipient}
                    placeholder="Select your own recipient"
                    className="h-12"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bank Transfer Section */}
          {withdrawalMethod === "bank" && (
            <div>
              <div>
                {bankAccounts.map((account) => (
                  <button
                    key={account.value}
                    type="button"
                    onClick={() => setSelectedBankAccount(account.value)}
                    className={cn(
                      "w-full p-4 text-left transition-all border-b-1 border-gray-1",
                      selectedBankAccount === account.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {selectedBankAccount === account.value ? (
                        <CheckedIcon className="w-5 h-5 text-primary" />
                      ) : (
                        <UncheckedIcon className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {account.label.split(" ****")[0]}
                        </div>
                        <div className="text-sm text-gray-500">
                          {account.label.includes("****") && (
                            <span>
                              **** **** **** {account.label.split("**** ")[4]}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          xyz street, near abc shop, Colony, state, country...
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Add New Bank Account */}
              <div className="border-b-1 border-gray-200 p-5">
                <CreateBankAccountDialog
                  trigger={
                    <div className="flex items-center gap-2 font-medium hover:text-primary/80 hover:bg-transparent transition-colors cursor-pointer">
                      Add New Bank Account Details
                    </div>
                  }
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 p-5">
            <ActionButton
              type="cancel"
              onClick={handleCancel}
              className="px-6 py-2 h-10"
              title="Cancel"
            />
            <ActionButton
              type="action"
              onClick={handleRequestWithdrawal}
              className="px-6 py-2 h-10 bg-primary hover:bg-primary/90"
              title="REQUEST WITHDRAWAL"
              disabled={
                !amount ||
                (withdrawalMethod === "bank" && !selectedBankAccount) ||
                (withdrawalMethod === "cash" && !selectedRecipient)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMoneyWithdrawalsPage;
