import React from "react";
import { Button } from "@/components/ui/button";
import FilterIcon from "@/assets/icons/filter-icon.svg?react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterButtonProps {
  onClick: () => void;
  onResetClick: () => void;
  onApplyFilters: () => void;
  active?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  onResetClick,
  onApplyFilters,
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
      <PopoverContent className="mx-2 flex items-end gap-2 w-fit">
        {children}
        <Button
          variant="default"
          title="Apply"
          className="ml-auto py-2 px-3"
          onClick={onApplyFilters}
        >
          Apply
        </Button>
        <Button
          variant="outline"
          title="Reset"
          className="ml-auto py-2 px-3"
          onClick={onResetClick}
        >
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
};
