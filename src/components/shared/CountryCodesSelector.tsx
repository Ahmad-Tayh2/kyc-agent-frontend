import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon, ChevronUpIcon, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Country {
  id: number;
  code: string;
  name: string;
}

interface CountryCodesSelectorProps {
  label?: string;
  placeholder?: string;
  countries: Country[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
}

const CountryCodesSelector: React.FC<CountryCodesSelectorProps> = ({
  label,
  placeholder,
  countries,
  value = [],
  onChange,
  disabled = false,
  className,
  dropdownClassName,
}) => {
  const { t } = useTranslation("global");
  const defaultPlaceholder =
    placeholder || t("modules.components.countrySelector.defaultPlaceholder");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleCountryToggle = (code: string) => {
    const newValue = value.includes(code)
      ? value.filter((v) => v !== code)
      : [...value, code];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    if (value.length === countries.length) {
      onChange([]);
    } else {
      onChange(countries.map((country) => country?.code));
    }
  };

  const filteredCountries = useMemo(() => {
    return (
      countries?.filter((country) =>
        country?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      ) ?? []
    );
  }, [countries, searchTerm]);

  const getDisplayText = () => {
    if (value.length === 0) return defaultPlaceholder;
    if (value.length === countries.length)
      return t("modules.components.countrySelector.all");
    if (value.length === 1) {
      const country = countries.find((c: Country) => c?.code === value[0]);
      return country?.name || defaultPlaceholder;
    }
    return t("modules.components.countrySelector.countriesSelected", {
      count: value.length,
    });
  };

  const isAllSelected = value.length === countries.length;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-[150px] justify-between h-[40px] bg-white border border-gray-300 rounded-md px-3 py-2 text-left",
          isOpen && "border-primary/50 ring-1 ring-primary"
        )}
      >
        <span className={cn("truncate", value.length === 0 && "text-gray-500")}>
          {getDisplayText()}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        )}
      </Button>

      {isOpen && (
        <div
          className={cn(
            dropdownClassName,
            "absolute z-50 w-[200px] sm:w-[320px] left-0 right-auto sm:left-auto sm:right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
          )}
        >
          <div className="p-2">
            {/* All option */}
            <div
              className="flex items-center space-x-2 py-2 px-1 hover:bg-primary/5  rounded cursor-pointer"
              onClick={handleSelectAll}
            >
              <Globe className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-gray-700">All</span>
              <Checkbox
                checked={isAllSelected}
                className="ml-auto data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
              />
            </div>

            {/* Search input */}
            <div className="relative mt-2 mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t("modules.components.phoneInput.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm"
              />
            </div>

            {/* Country list */}
            <div className="overflow-y-auto max-h-60">
              {filteredCountries?.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center space-x-2 py-2 px-1 hover:bg-primary/5 rounded cursor-pointer"
                  onClick={() => handleCountryToggle(country?.code)}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg">
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{
                          width: "25px",
                          borderRadius: "6px",
                        }}
                      />
                    </span>
                    <span className="text-sm text-gray-700">
                      {country?.name}
                    </span>
                  </div>
                  <Checkbox
                    checked={value?.includes(country?.code)}
                    onCheckedChange={() => handleCountryToggle(country?.code)}
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                  />
                </div>
              ))}
            </div>

            {filteredCountries.length === 0 && searchTerm && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCodesSelector;
