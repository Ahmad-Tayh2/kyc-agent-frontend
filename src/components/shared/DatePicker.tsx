import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: any;
  disabled?: boolean;
  startMonth?: Date;
  endMonth?: Date;
  disabledBefore?: Date;
  disabledAfter?: Date;
  prop?: string;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export default function DatePicker({
  label,
  value,
  onChange,
  disabled,
  startMonth,
  endMonth,
  disabledBefore,
  disabledAfter,
  prop,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const disableRange = React.useMemo(() => {
    let range = null;
    if (disabledBefore) range = { before: disabledBefore };
    if (disabledAfter) {
      if (!range) range = { after: disabledAfter };
      else range = { ...range, after: disabledAfter };
    }
    return range;
  }, [disabledBefore, disabledAfter]);
  // Initialize date state from value prop (ISO string)
  const initialDate = value ? new Date(value) : undefined;
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date | undefined>(initialDate);
  const [displayValue, setDisplayValue] = React.useState<string>(
    formatDate(initialDate)
  );
  React.useEffect(() => {
    console.log("prop = ", prop);
  }, [prop]);
  // When value prop changes, update internal state
  React.useEffect(() => {
    const newDate = value ? new Date(value) : undefined;
    setDate(newDate);
    setMonth(newDate);
    setDisplayValue(formatDate(newDate));
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setMonth(selectedDate);
      setDisplayValue(formatDate(selectedDate));
      // Pass the ISO string back to parent
      // Convert JS Date to Luxon DateTime, then to 'YYYY-MM-DD' string
      onChange(DateTime.fromJSDate(selectedDate).toISODate());
      setOpen(false);
    }
  };
  return (
    <div>
      {label && (
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <div className="flex items-center relative w-full">
        <Input
          id="date"
          value={displayValue}
          placeholder="Select a Date"
          className={cn(
            "bg-background pr-10 h-[40px]",
            !disabled && "disabled:opacity-100 disabled:bg-transparent" //remove the low opacity when editing the input because this field should be always disabled and should not show the disabled bg
          )}
          onChange={(e) => {
            const newValue = e.target.value;
            setDisplayValue(newValue);
            // Try to parse date from input (optional: you can enhance parsing)
            const parsedDate = new Date(newValue);
            if (isValidDate(parsedDate)) {
              setDate(parsedDate);
              setMonth(parsedDate);
              onChange(DateTime.fromJSDate(parsedDate).toISODate());
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          disabled //always disabled, user can only choose date from calendar
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              disabled={disabled}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            {disableRange ? (
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
                startMonth={startMonth}
                endMonth={endMonth}
                disabled={disableRange}
              />
            ) : (
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
                startMonth={startMonth}
                endMonth={endMonth}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
