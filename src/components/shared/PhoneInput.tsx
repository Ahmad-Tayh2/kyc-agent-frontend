import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, CheckIcon } from "lucide-react";

interface CountryOption {
  value: string;
  label: string;
  code: string;
  countryCode: string;
}

interface PhoneInputProps {
  placeholder?: string;
  countryOptions?: CountryOption[];
  selectedCountry?: string;
  phoneNumber: string;
  onCountryChange?: (countryCode: string) => void;
  onPhoneChange: (phoneNumber: string) => void;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder,
  countryOptions,
  selectedCountry,
  phoneNumber,
  onCountryChange,
  onPhoneChange,
  error,
  disabled = false,
  loading = false,
}) => {
  const { t } = useTranslation("global");
  const defaultPlaceholder =
    placeholder || t("modules.components.phoneInput.defaultPlaceholder");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<CountryOption | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find selected option based on selectedCountry
  useEffect(() => {
    if (selectedCountry && countryOptions?.length) {
      const countryPhoneCode = selectedCountry?.startsWith("+")
        ? selectedCountry?.slice(1)
        : selectedCountry;
      const option = countryOptions?.find(
        (opt) => opt.value === countryPhoneCode
      );
      setSelectedOption(option || null);
    }
  }, [selectedCountry, countryOptions]);

  // Filter options based on search term
  const filteredOptions = countryOptions?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (option: CountryOption) => {
    setSelectedOption(option);
    onCountryChange?.(option.value);

    // Clear the previous phone number
    onPhoneChange("");

    setIsOpen(false);
    setSearchTerm("");

    // Auto-focus the input after country selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleCountryInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPhoneChange(value);
  };

  // const handlePhoneInputKeyDown = (
  //   e: React.KeyboardEvent<HTMLInputElement>
  // ) => {
  //   if (!selectedOption) return;

  //   const phoneCode = selectedOption.code;
  //   const expectedPrefix = `${phoneCode} `;
  //   const cursorPosition = e.currentTarget.selectionStart || 0;

  //   // Account for the "+" prefix in cursor position
  //   const adjustedCursorPosition = cursorPosition > 0 ? cursorPosition - 1 : 0;

  //   // Prevent backspace/delete if it would remove the phone code or space
  //   if (
  //     (e.key === "Backspace" || e.key === "Delete") &&
  //     adjustedCursorPosition <= expectedPrefix.length
  //   ) {
  //     e.preventDefault();
  //   }
  // };

  // const handlePhoneInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
  //   if (!selectedOption) return;

  //   const phoneCode = selectedOption.code;
  //   const expectedPrefix = `${phoneCode} `;
  //   const cursorPosition = e.currentTarget.selectionStart || 0;

  //   // Account for the "+" prefix in cursor position
  //   const adjustedCursorPosition = cursorPosition > 0 ? cursorPosition - 1 : 0;

  //   // If user clicks before the phone code, move cursor to after the space
  //   if (adjustedCursorPosition < expectedPrefix.length) {
  //     setTimeout(() => {
  //       if (inputRef.current) {
  //         // Add 1 to account for the "+" prefix
  //         inputRef.current.setSelectionRange(
  //           expectedPrefix.length + 1,
  //           expectedPrefix.length + 1
  //         );
  //       }
  //     }, 0);
  //   }
  // };

  // const displayValue = selectedOption
  //   ? phoneNumber.startsWith(selectedOption.code)
  //     ? phoneNumber
  //     : `${selectedOption.code} ${phoneNumber.replace(/^\+\d+\s*/, "")}`
  //   : phoneNumber;

  return (
    <div className="flex flex-col gap-1">
      <div
        className="relative flex items-center border border-input rounded-md bg-background
            focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors duration-300"
        ref={containerRef}
      >
        {/* Country Flag Select */}
        <div className="relative h-full">
          <button
            type="button"
            onClick={handleCountryInputClick}
            disabled={disabled}
            className="flex items-center gap-2 px-2 py-1 rounded-tl-md rounded-bl-md border-r border-input bg-transparent h-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-[#E5E5E5] disabled:text-[#101828] disabled:opacity-50"
          >
            {selectedOption ? (
              <>
                <span className="text-lg">
                  <ReactCountryFlag
                    countryCode={selectedOption.countryCode}
                    svg
                    style={{
                      width: "20px",
                      borderRadius: "6px",
                    }}
                  />
                </span>

                <span className="text-xs">+{selectedOption.code}</span>
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </>
            ) : (
              <>
                <span className="text-lg"></span>
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </button>

          {isOpen && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto w-[50px] min-w-[150px]">
              {loading ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              ) : filteredOptions?.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No countries found
                </div>
              ) : (
                filteredOptions?.map((option) => (
                  <div
                    key={option.countryCode}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2",
                      selectedOption?.value === option.value && "bg-blue-50"
                    )}
                    onClick={() => handleCountrySelect(option)}
                  >
                    <span className="text-lg">
                      <ReactCountryFlag
                        countryCode={option.countryCode}
                        svg
                        style={{
                          width: "25px",
                          borderRadius: "6px",
                        }}
                      />
                    </span>
                    <span className="flex-1 text-xs">{option.countryCode}</span>
                    <span className="text-muted-foreground">
                      +{option.code}
                    </span>
                    {selectedOption?.value === option.value && (
                      <CheckIcon className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <Input
          ref={inputRef}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneInputChange}
          // onKeyDown={handlePhoneInputKeyDown}
          // onClick={handlePhoneInputClick}
          placeholder={defaultPlaceholder}
          disabled={disabled || !selectedOption?.code}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 rounded-none"
        />
      </div>
      {error && <span className="text-destructive text-xs">{error}</span>}
    </div>
  );
};

export default PhoneInput;
