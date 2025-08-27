import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
interface Option {
  label: string;
  value: string;
}
interface SingleSelectDropdownProps {
  options: Option[];
  onValueChange: any;
  placeholder?: string;
  className?: string;
  selectedValue: string;
}
export function SingleSelectDropdown(props: SingleSelectDropdownProps) {
  const { options, onValueChange, placeholder, className, selectedValue } =
    props;
  return (
    <Select onValueChange={onValueChange} value={selectedValue}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option: Option) => (
          <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
