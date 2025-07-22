import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface DateRangeOption {
  value: string;
  label: string;
  getDates: () => { startDate: Date; endDate: Date };
}

interface DateRangeSelectorProps {
  label?: string;
  placeholder?: string;
  value: { startDate: Date | null; endDate: Date | null };
  onChange: (value: { startDate: Date | null; endDate: Date | null }) => void;
  disabled?: boolean;
  className?: string;
  customRangeLabel?: string;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  label,
  placeholder = "Select date range",
  value,
  onChange,
  disabled = false,
  className,
  customRangeLabel = "Custom Range",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(
    value.startDate || undefined
  );
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(
    value.endDate || undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const predefinedOptions: DateRangeOption[] = [
    {
      value: "today",
      label: "Today",
      getDates: () => {
        const today = new Date();
        return { startDate: today, endDate: today };
      },
    },
    {
      value: "yesterday",
      label: "Yesterday",
      getDates: () => {
        const yesterday = subDays(new Date(), 1);
        return { startDate: yesterday, endDate: yesterday };
      },
    },
    {
      value: "last7days",
      label: "Last 7 Days",
      getDates: () => {
        const endDate = new Date();
        const startDate = subDays(endDate, 6);
        return { startDate, endDate };
      },
    },
    {
      value: "last30days",
      label: "Last 30 Days",
      getDates: () => {
        const endDate = new Date();
        const startDate = subDays(endDate, 29);
        return { startDate, endDate };
      },
    },
    {
      value: "thisMonth",
      label: "This Month",
      getDates: () => {
        const now = new Date();
        return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
      },
    },
    {
      value: "lastMonth",
      label: "Last Month",
      getDates: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
        };
      },
    },
    {
      value: "custom",
      label: customRangeLabel,
      getDates: () => ({ startDate: new Date(), endDate: new Date() }),
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowCustomRange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option: DateRangeOption) => {
    if (option.value === "custom") {
      setShowCustomRange(true);
      return;
    }

    const { startDate, endDate } = option.getDates();
    onChange({ startDate, endDate });
    setIsOpen(false);
    setShowCustomRange(false);
  };

  const handleCustomRangeApply = () => {
    if (tempStartDate && tempEndDate) {
      onChange({ startDate: tempStartDate, endDate: tempEndDate });
      setIsOpen(false);
      setShowCustomRange(false);
    }
  };

  const handleCustomRangeCancel = () => {
    setTempStartDate(value.startDate || undefined);
    setTempEndDate(value.endDate || undefined);
    setShowCustomRange(false);
  };

  const getDisplayText = () => {
    if (!value.startDate || !value.endDate) return placeholder;

    if (value.startDate.toDateString() === value.endDate.toDateString()) {
      return format(value.startDate, "dd-MM-yyyy");
    }

    return `${format(value.startDate, "dd-MM-yy")} - ${format(
      value.endDate,
      "dd-MM-yy"
    )}`;
  };

  const isCustomRangeSelected = () => {
    if (!value.startDate || !value.endDate) return false;

    // Check if the current selection doesn't match any predefined option
    return !predefinedOptions.some((option) => {
      if (option.value === "custom") return false;
      const { startDate, endDate } = option.getDates();
      return (
        startDate.toDateString() === value.startDate?.toDateString() &&
        endDate.toDateString() === value.endDate?.toDateString()
      );
    });
  };

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
          "w-full justify-between h-[40px] bg-white border border-gray-300 rounded-md px-3 py-2 text-left",
          isOpen && "border-blue-500 ring-1 ring-blue-500"
        )}
      >
        <span
          className={cn(
            "truncate",
            (!value.startDate || !value.endDate) && "text-gray-500"
          )}
        >
          {getDisplayText()}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {!showCustomRange ? (
            <div className="p-2">
              {predefinedOptions.map((option) => {
                const isSelected =
                  option.value === "custom"
                    ? isCustomRangeSelected()
                    : (() => {
                        const { startDate, endDate } = option.getDates();
                        return (
                          startDate.toDateString() ===
                            value.startDate?.toDateString() &&
                          endDate.toDateString() ===
                            value.endDate?.toDateString()
                        );
                      })();

                return (
                  <div
                    key={option.value}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded",
                      isSelected && "bg-teal-50 text-teal-700"
                    )}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <Calendar
                  mode="single"
                  selected={tempStartDate || undefined}
                  onSelect={setTempStartDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <Calendar
                  mode="single"
                  selected={tempEndDate || undefined}
                  onSelect={setTempEndDate}
                  className="rounded-md border"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleCustomRangeApply}
                  disabled={!tempStartDate || !tempEndDate}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCustomRangeCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
