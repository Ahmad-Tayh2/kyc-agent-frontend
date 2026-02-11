import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { SearchInput } from "./SearchInput";

interface Option {
  label: string;
  value: string;
  name?: string;
}
interface SearchableSelectProps {
  label?: string;
  required?: boolean;
  options: Option[];
  extraOption?: Option;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  searchTermValue?: string;
  onSearchTermChange?: (value: string) => void;
}

export function SingleSearchableSelect({
  label,
  required,
  options,
  extraOption,
  value,
  onChange,
  placeholder = "Select...",
  className,
  searchTermValue,
  onSearchTermChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if (searchTermValue !== searchTerm) {
      setSearchTerm(searchTermValue ?? "");
    }
  }, [searchTermValue]);
  const selected = (extraOption ? [extraOption, ...options] : options)?.find(
    (o) => o.value === value,
  );
  const filteredOptions = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (extraOption ? [extraOption, ...options] : options)?.filter(
      (option: Option) =>
        option.label?.toString().toLowerCase().includes(lowerSearchTerm),
    );
  }, [searchTerm, options]);
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between h-[40px]", className)}
          >
            {selected?.value === extraOption?.value ? (
              <b>{selected?.label}</b>
            ) : (
              (selected?.label ?? placeholder)
            )}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-2" align="start">
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
          <div className="max-h-60 overflow-y-auto overflow-x-hidden">
            {filteredOptions?.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-primary/5 rounded cursor-pointer"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    option?.value === value ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="text-sm text-gray-700">
                  {option?.value === extraOption?.value ? (
                    <b>{option?.label}</b>
                  ) : (
                    option?.label
                  )}
                </span>
              </div>
            ))}
          </div>
          {/* <Command>
            <CommandInput placeholder="Search..." autoFocus />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {(extraOption ? [extraOption, ...options] : options)?.map(
                (option, index: number) => (
                  <CommandItem
                    key={index}
                    value={option?.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="hover:!bg-prim cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        option?.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {extraOption && index === 0 ? (
                      <b>{option?.label}</b>
                    ) : (
                      option?.label
                    )}
                  </CommandItem>
                ),
              )}
            </CommandGroup>
          </Command> */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
