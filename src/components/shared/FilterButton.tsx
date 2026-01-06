import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("global");

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" onClick={onClick} className="h-[45px]">
          <FilterIcon />
          {title || t("modules.components.filterButton.defaultTitle")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mx-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap items-end gap-2 w-fit">
        {children}
        <div className="flex gap-1 flex-row w-full sm:w-auto">
          <Button
            variant="default"
            title={t("modules.components.filterButton.apply")}
            className="ml-auto py-2 px-3 flex-1"
            onClick={onApplyFilters}
          >
            {t("modules.components.filterButton.apply")}
          </Button>
          <Button
            variant="outline"
            title={t("modules.components.filterButton.reset")}
            className="ml-auto py-2 px-3 flex-1"
            onClick={onResetClick}
          >
            {t("modules.components.filterButton.reset")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
