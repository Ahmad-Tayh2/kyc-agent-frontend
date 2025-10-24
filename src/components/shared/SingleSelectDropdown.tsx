import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
interface Option {
  label: string;
  value: string;
  name?: string;
}
interface SingleSelectDropdownProps {
  label?: string;
  required?: boolean;
  options: Option[];
  extraOption?: Option;
  onValueChange: any;
  placeholder?: string;
  className?: string;
  selectedValue: string;
}
export function SingleSelectDropdown(props: SingleSelectDropdownProps) {
  const {
    label,
    required,
    options,
    extraOption,
    onValueChange,
    placeholder,
    className,
    selectedValue,
  } = props;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select onValueChange={onValueChange} value={selectedValue}>
        <SelectTrigger className={cn("w-full !h-[40px]", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {extraOption && (
            <SelectItem value={extraOption?.value}>
              <b>{extraOption?.label}</b>
            </SelectItem>
          )}
          {options?.map((option: Option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
