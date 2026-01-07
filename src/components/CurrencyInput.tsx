import { CURRENCY_COUNTRY_CODE } from "@/constants/currencies";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Input } from "./ui/input";

interface CurrencyOption {
  id: number;
  code: string;
  name?: string;
}

// Helper function to get country code for currency flag
const getCurrencyCountryCode = (currencyCode: string): string => {
  return CURRENCY_COUNTRY_CODE[currencyCode?.toUpperCase()] || "";
};

interface CurrencyInputProps {
  placeholder?: string;
  amountPlaceholder?: string;
  currencyOptions: CurrencyOption[];
  selectedCurrencyId?: number;
  amount: number;
  onCurrencyChange?: (currencyId: number) => void;
  onAmountChange?: (amount: number) => void;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  showBalance?: boolean;
  availableBalance?: number;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  placeholder = "Select currency",
  amountPlaceholder = "Enter amount",
  currencyOptions,
  selectedCurrencyId,
  amount,
  onCurrencyChange,
  onAmountChange,
  error,
  disabled = false,
  loading = false,
  readOnly = false,
  // showBalance = false,
  // availableBalance,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<CurrencyOption | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find selected option based on selectedCurrencyId
  useEffect(() => {
    const option = currencyOptions?.find(
      (opt) => opt.id === selectedCurrencyId
    );
    setSelectedOption(option || null);
  }, [selectedCurrencyId, currencyOptions]);

  // Filter options based on search term
  const filteredOptions = currencyOptions?.filter(
    (option) =>
      option.code?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      (option.name &&
        option.name?.toLowerCase().includes(searchTerm?.toLowerCase()))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef?.current &&
        !containerRef?.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencySelect = (option: CurrencyOption) => {
    setSelectedOption(option);
    onCurrencyChange?.(option.id);
    setIsOpen(false);
    setSearchTerm("");

    // Auto-focus the amount input after currency selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleCurrencyInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onAmountChange?.(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "bg-red-200 relative flex items-center border border-input rounded-md bg-background transition-colors duration-300",
          "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          readOnly && "bg-gray-50"
        )}
        ref={containerRef}
      >
        {/* Currency Flag Select */}
        <div className="relative h-full">
          <button
            type="button"
            onClick={handleCurrencyInputClick}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-tl-md rounded-bl-md border-r border-input bg-transparent h-full transition-colors",
              "hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              "min-w-[80px]"
            )}
          >
            {selectedOption ? (
              <>
                <span className="text-lg">
                  {getCurrencyCountryCode(selectedOption.code) ? (
                    <ReactCountryFlag
                      countryCode={getCurrencyCountryCode(selectedOption.code)}
                      svg
                      style={{
                        width: "25px",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <span className="text-sm">💱</span>
                  )}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedOption.code}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500">
                  {placeholder.slice(0, 6)}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </button>

          {isOpen && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto min-w-[200px]">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <Input
                  type="text"
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-8 text-sm"
                  autoFocus
                />
              </div>

              {loading ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              ) : filteredOptions?.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No currencies found
                </div>
              ) : (
                filteredOptions?.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-3",
                      selectedOption?.id === option?.id && "bg-blue-50"
                    )}
                    onClick={() => handleCurrencySelect(option)}
                  >
                    <span className="text-lg">
                      {getCurrencyCountryCode(option?.code) ? (
                        <ReactCountryFlag
                          countryCode={getCurrencyCountryCode(option?.code)}
                          svg
                          style={{
                            width: "25px",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        <span className="text-sm">💱</span>
                      )}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium">{option?.code}</span>
                      {option?.name && (
                        <div className="text-xs text-gray-500">
                          {option?.name}
                        </div>
                      )}
                    </div>
                    {selectedOption?.id === option?.id && (
                      <CheckIcon className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <Input
          ref={inputRef}
          type="number"
          step="0.01"
          min="0"
          value={amount || ""}
          onChange={handleAmountChange}
          placeholder={amountPlaceholder}
          disabled={disabled || !selectedOption}
          readOnly={readOnly}
          className={cn(
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 rounded-l-none",
            readOnly && "bg-transparent"
          )}
        />
      </div>

      {/* Balance Display */}
      {/* {showBalance && availableBalance !== undefined && selectedOption && (
        <div className="text-sm text-gray-600">
          Available balance:{" "}
          <span className="font-semibold text-gray-900">
            {availableBalance.toFixed(2)} {selectedOption.code}
          </span>
        </div>
      )} */}

      {error && <span className="text-destructive text-xs">{error}</span>}
    </div>
  );
};

export default CurrencyInput;
