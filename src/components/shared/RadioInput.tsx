import React from "react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import { cn } from "@/lib/utils";

type OptionType = {
  label: string;
  value: string | number;
};

type CustomRadioProps = {
  options: OptionType[];
  selectedValue: string | number | null;
  onChange: (value: string | number) => void;
  className?: string;
};

const RadioInput: React.FC<CustomRadioProps> = ({
  options,
  selectedValue,
  onChange,
  className,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {options.map((option: OptionType) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "w-full flex items-center border gap-1 rounded-lg px-4 py-3 text-[14px] text-left transition",
            "border-gray-200 bg-white"
          )}
          onClick={() => {
            onChange(option.value);
          }}
        >
          {selectedValue === option.value ? <CheckedIcon /> : <UncheckedIcon />}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default RadioInput;
