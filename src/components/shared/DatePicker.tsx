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

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: any;
  disabled?: boolean;
  startMonth?: Date;
  endMonth?: Date;
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
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Initialize date state from value prop (ISO string)
  const initialDate = value ? new Date(value) : undefined;
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date | undefined>(initialDate);
  const [displayValue, setDisplayValue] = React.useState<string>(
    formatDate(initialDate)
  );

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
          className="bg-background pr-10 h-[40px] "
          onChange={(e) => {
            console.log(" value ", e.target.value);
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
          disabled={disabled}
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
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
