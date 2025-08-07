import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/shared/PhoneInput";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipientRemittanceMethodsProps {
  formData: {
    remittance_methods: string[];
    cash_pickup_addresses: Array<{
      id: string;
      name: string;
      phone: string;
      address: string;
      selected: boolean;
    }>;
    wallet_accounts: Array<{
      id: string;
      wallet_type: string;
      phone: string;
      account_number: string;
      selected: boolean;
    }>;
    search_available_wallets: boolean;
    search_mobile_number: string;
    search_wallet_account: string;
  };
  handleInputChange: (field: string, value: any) => void;
  countryPhoneOptions: Array<{
    value: string;
    label: string;
    code: string;
    countryCode: string;
  }>;
}

const RecipientRemittanceMethods: React.FC<RecipientRemittanceMethodsProps> = ({
  formData,
  handleInputChange,
  countryPhoneOptions,
}) => {
  const handleAddressSelection = (addressId: string) => {
    handleInputChange(
      "cash_pickup_addresses",
      formData.cash_pickup_addresses.map((addr) =>
        addr.id === addressId
          ? { ...addr, selected: !addr.selected }
          : { ...addr, selected: false }
      )
    );
  };

  const handleWalletSelection = (walletId: string) => {
    handleInputChange(
      "wallet_accounts",
      formData.wallet_accounts.map((w) =>
        w.id === walletId
          ? { ...w, selected: !w.selected }
          : { ...w, selected: false }
      )
    );
  };
  return (
    <div className="space-y-6 p-5">
      {/* Cash Pick up address section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cash Pick up address</h3>
        <div className="space-y-3">
          {formData.cash_pickup_addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition",
                address.selected
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-gray-300"
              )}
              onClick={() => handleAddressSelection(address.id)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={address.selected}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div className="flex flex-col items-start">
                  <div className="flex-1 flex gap-5 items-center font-medium">
                    <div>{address.name}</div>
                    <div>{address.phone}</div>
                  </div>
                  <div className="text-sm text-gray-500">{address.address}</div>
                </div>
              </div>
            </div>
          ))}
          <hr />
          <Button
            variant="ghost"
            className="w-fit text-primary hover:bg-transparent hover:text-primary"
          >
            <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center">
              <Plus className="text-white" />
            </div>
            Add New Address
          </Button>
          <hr />
        </div>
      </div>

      {/* Wallet Account section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Wallet Account</h3>
        <div className="space-y-3">
          {formData.wallet_accounts.map((wallet) => (
            <div
              key={wallet.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition",
                wallet.selected
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-gray-300"
              )}
              onClick={() => handleWalletSelection(wallet.id)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={wallet.selected}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">
                    {wallet.wallet_type} • {wallet.phone} •{" "}
                    {wallet.account_number}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <hr />
          <Button
            variant="ghost"
            className="w-fit text-primary hover:bg-transparent hover:text-primary"
          >
            <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center">
              <Plus className="text-white" />
            </div>
            Add New Wallet
          </Button>
          <hr />
        </div>
      </div>

      {/* Search for available wallets section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="search_available_wallets"
            checked={formData.search_available_wallets}
            onCheckedChange={(checked) =>
              handleInputChange("search_available_wallets", checked)
            }
          />
          <Label htmlFor="search_available_wallets">
            search for the available wallets
          </Label>
        </div>

        {formData.search_available_wallets && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">Mobile Number</Label>
              <PhoneInput
                placeholder="Enter mobile number"
                countryOptions={countryPhoneOptions}
                selectedCountry=""
                phoneNumber={formData.search_mobile_number || ""}
                onCountryChange={(countryCode: string) =>
                  handleInputChange("country_phone_code", countryCode)
                }
                onPhoneChange={(phoneNumber: string) =>
                  handleInputChange("search_mobile_number", phoneNumber)
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">Wallet Account Number</Label>
              <Input
                placeholder="Enter wallet account number"
                value={formData.search_wallet_account || ""}
                onChange={(e) =>
                  handleInputChange("search_wallet_account", e.target.value)
                }
              />
            </div>

            <div className="flex items-end">
              <Button className="bg-primary hover:bg-primary/90">
                <Search className="h-4 w-4 mr-2" />
                SEARCH
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientRemittanceMethods;
