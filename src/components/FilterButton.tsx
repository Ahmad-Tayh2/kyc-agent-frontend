import React from "react";
import { Button } from "@/components/ui/button";
import FilterIcon from "@/assets/icons/filter-icon.svg?react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ActionButton from "@/components/ActionButton";

interface FilterButtonProps {
  onClick: () => void;
  onResetClick: () => void;
  active?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  children,
  title,
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" onClick={onClick} className="h-[40px]">
          <FilterIcon />
          {title || "Filters"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mx-2 flex items-center gap-2">
        {children}
        <ActionButton title="reset" className="ml-auto py-2 px-3" />
      </PopoverContent>
    </Popover>
  );
};
