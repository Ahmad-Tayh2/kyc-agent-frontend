import { cn } from "@/lib/utils";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";

export default function (props: any) {
  const {
    options,
    disabled,
    onSelectValue,
    selectedValue,
    className = "",
  } = props;
  return (
    <div className="flex items-center gap-1">
      {options?.map((optionItem: any) => (
        <button
          key={optionItem.value}
          type="button"
          className={cn(
            className,
            "w-full flex items-center border gap-1 rounded-lg px-4 py-3 text-[14px] text-left transition",
            "border-gray-200 bg-white disabled:cursor-not-allowed disabled:bg-[#E5E5E5] disabled:text-[#101828] disabled:opacity-50"
          )}
          onClick={() => onSelectValue(optionItem.value)}
          disabled={disabled}
        >
          {selectedValue === optionItem.value ? (
            <CheckedIcon />
          ) : (
            <UncheckedIcon />
          )}
          {optionItem.label}
        </button>
      ))}
    </div>
  );
}
