import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/shared/SearchInput";

interface Option {
  value: string;
  label: string | React.ReactElement;
}

interface MultiSelectDropdownProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  showSelectAll?: boolean;
  isSearchable?: boolean;
  checkboxPlacement?: "left" | "right";
  searchTermValue?: string;
  onSearchTermChange?: (value: string) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  required,
  placeholder = "Select options",
  options,
  value = [],
  onChange,
  disabled = false,
  className,
  showSelectAll = false,
  isSearchable = false,
  checkboxPlacement = "left",
  searchTermValue,
  onSearchTermChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  // React.useEffect(() => {
  //   if (!value || value?.length === 0) {
  //     setSearchTerm("");
  //     onSearchTermChange?.("");
  //   }
  // }, [value]);
  React.useEffect(() => {
    if (searchTermValue !== searchTerm) {
      setSearchTerm(searchTermValue ?? "");
    }
  }, [searchTermValue]);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = React.useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return options?.filter((option: Option) =>
      option.label?.toString().toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm, options]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    if (value.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((option) => option.value));
    }
  };
  const isAllSelected = value.length === options.length;

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === options.length && showSelectAll) return "All";
    if (value.length === 1) {
      const option = options.find((opt) => opt.value === value[0]);
      if (!option) return placeholder;

      // If the label is a JSX element, return a simplified string representation
      return typeof option.label === "string" ? option.label : option.value; // Fallback to value if label is JSX
    }
    return `${value.length} selected`;
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <Label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "min-w-[120px] w-full justify-between h-[40px] bg-white border border-gray-300 rounded-md px-3 py-2 text-left",
          isOpen && "border-blue-500 ring-1 ring-blue-500"
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
        <div className="absolute w-max min-w-full z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg ">
          <div className="p-2">
            {showSelectAll && (
              <div
                className="flex items-center space-x-2 p-2 hover:bg-primary/5 rounded cursor-pointer"
                onClick={handleSelectAll}
              >
                {checkboxPlacement === "left" && (
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                  />
                )}
                <span className="text-sm text-gray-700">Select All</span>
                {checkboxPlacement === "right" && (
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 ml-auto"
                  />
                )}
              </div>
            )}
            {isSearchable && (
              <div className="my-2">
                <SearchInput
                  value={searchTerm}
                  onChange={(value: string) => {
                    setSearchTerm(value);
                    onSearchTermChange?.(value);
                  }}
                  className="w-full"
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto overflow-x-hidden">
              {filteredOptions?.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-2 hover:bg-primary/5 rounded cursor-pointer"
                  onClick={() => handleOptionToggle(option.value)}
                >
                  {checkboxPlacement === "left" && (
                    <Checkbox
                      checked={value.includes(option.value)}
                      onCheckedChange={() => handleOptionToggle(option.value)}
                      className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                  )}

                  <span className="text-sm text-gray-700">
                    {typeof option.label === "string"
                      ? option.label
                      : option.label}
                  </span>
                  {checkboxPlacement === "right" && (
                    <Checkbox
                      checked={value.includes(option.value)}
                      onCheckedChange={() => handleOptionToggle(option.value)}
                      className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 ml-auto"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
