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
}
interface SingleSelectDropdownProps {
  label?: string;
  options: Option[];
  onValueChange: any;
  placeholder?: string;
  className?: string;
  selectedValue: string;
}
export function SingleSelectDropdown(props: SingleSelectDropdownProps) {
  const {
    label,
    options,
    onValueChange,
    placeholder,
    className,
    selectedValue,
  } = props;
  return (
    <div>
      {label && (
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <Select onValueChange={onValueChange} value={selectedValue}>
        <SelectTrigger className={cn("w-full !h-[40px]", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
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
