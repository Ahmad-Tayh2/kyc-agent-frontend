import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";
import ErrorField from "@/components/shared/ErrorField";

interface RecipientBankDetailsProps {
  formData: {
    bank_details: {
      bank_name: string;
      account_number: string;
      swift_code: string;
      account_type: string;
      iban_code: string;
      bic_code: string;
      bank_address: string;
      currency_id: string;
      extra_address_details: string;
      state_id: string;
    };
  };
  handleBankDetailsChange: (field: string, value: any) => void;
  accountTypeOptions: Array<{ label: string; value: string }>;
  currencyOptions: Array<{ label: string; value: string }>;
  stateOptions: Array<{ label: string; value: string }>;
  validationErrors?: any;
}

const RecipientBankDetails: React.FC<RecipientBankDetailsProps> = ({
  formData,
  handleBankDetailsChange,
  accountTypeOptions,
  currencyOptions,
  stateOptions,
  validationErrors,
}) => {
  return (
    <div className="space-y-6 p-5 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {/* IBAN and Account Number in a row */}
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="iban">
            IBAN
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="iban"
            placeholder="Enter IBAN"
            value={formData.bank_details.iban_code || ""}
            onChange={(e) =>
              handleBankDetailsChange("iban_code", e.target.value)
            }
          />
          {validationErrors?.iban_code && (
            <ErrorField errors={[validationErrors?.iban_code[0]]} />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="account_number">
            Account Number
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="account_number"
            placeholder="Enter account number"
            value={formData.bank_details.account_number || ""}
            onChange={(e) =>
              handleBankDetailsChange("account_number", e.target.value)
            }
          />
          {validationErrors?.account_number && (
            <ErrorField errors={[validationErrors?.account_number[0]]} />
          )}
        </div>

        {/* Swift Code and BIC Code in a row */}
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="swift_code">
            Swift Code
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="swift_code"
            placeholder="Enter swift code"
            value={formData.bank_details.swift_code || ""}
            onChange={(e) =>
              handleBankDetailsChange("swift_code", e.target.value)
            }
          />
          {validationErrors?.swift_code && (
            <ErrorField errors={[validationErrors?.swift_code[0]]} />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="bic_code">
            BIC Code
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bic_code"
            placeholder="Enter BIC code"
            value={formData.bank_details.bic_code || ""}
            onChange={(e) =>
              handleBankDetailsChange("bic_code", e.target.value)
            }
          />
          {validationErrors?.bic_code && (
            <ErrorField errors={validationErrors?.bic_code} />
          )}
        </div>

        {/* Bank Name and Account Type in a row */}
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="bank_name">
            Bank Name
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bank_name"
            placeholder="Enter bank name"
            value={formData.bank_details.bank_name || ""}
            onChange={(e) =>
              handleBankDetailsChange("bank_name", e.target.value)
            }
          />
          {validationErrors?.bank_name && (
            <ErrorField errors={validationErrors?.bank_name} />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <SearchableSelect
            label="Account Type"
            options={accountTypeOptions}
            value={formData.bank_details.account_type || ""}
            onChange={(value) => handleBankDetailsChange("account_type", value)}
            placeholder="Select the account type"
            required
            error={validationErrors?.account_type?.[0]}
          />
        </div>

        {/* Currency and State in a row */}
        <div className="flex flex-col gap-1">
          <SearchableSelect
            label="Currency"
            options={currencyOptions}
            value={formData.bank_details.currency_id || ""}
            onChange={(value) => handleBankDetailsChange("currency_id", value)}
            placeholder="Select currency"
            required
            error={validationErrors?.currency_id?.[0]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SearchableSelect
            label="State/Province"
            options={stateOptions}
            value={formData.bank_details.state_id || ""}
            onChange={(value) => handleBankDetailsChange("state_id", value)}
            placeholder="Select state/province"
          />
        </div>

        {/* Extra Address Details field */}
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="extra_address_details">
            Extra Address Details
          </Label>
          <Input
            id="extra_address_details"
            placeholder="e.g., Apt 4B, Floor 2"
            value={formData.bank_details.extra_address_details || ""}
            onChange={(e) =>
              handleBankDetailsChange("extra_address_details", e.target.value)
            }
          />
        </div>

        {/* Bank Address field in a row (spanning full width) */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <Label className="text-[14px]" htmlFor="bank_address">
            Bank Address
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="bank_address"
            placeholder="Enter bank address"
            value={formData.bank_details.bank_address || ""}
            onChange={(e) =>
              handleBankDetailsChange("bank_address", e.target.value)
            }
            rows={3}
            className="resize-none w-full"
          />
          {validationErrors?.bank_address && (
            <ErrorField errors={validationErrors?.bank_address} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientBankDetails;
