import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";

interface RecipientBankDetailsProps {
  formData: {
    bank_details: {
      bank_name: string;
      account_number: string;
      swift_code: string;
      account_type: string;
      iban: string;
      bic_code: string;
      bank_address: string;
    };
  };
  handleBankDetailsChange: (field: string, value: any) => void;
  accountTypeOptions: Array<{ label: string; value: string }>;
}

const RecipientBankDetails: React.FC<RecipientBankDetailsProps> = ({
  formData,
  handleBankDetailsChange,
  accountTypeOptions,
}) => {
  return (
    <div className="space-y-6 p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* IBAN and Account Number in a row */}
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="iban">
            IBAN
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="iban"
            placeholder="Enter IBAN"
            value={formData.bank_details.iban || ""}
            onChange={(e) => handleBankDetailsChange("iban", e.target.value)}
          />
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
        </div>

        <div className="flex flex-col gap-1">
          <SearchableSelect
            label="Account Type"
            options={accountTypeOptions}
            value={formData.bank_details.account_type || ""}
            onChange={(value) => handleBankDetailsChange("account_type", value)}
            placeholder="Select the account type"
            required
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
        </div>
      </div>
    </div>
  );
};

export default RecipientBankDetails;
