import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ExportOption {
  label: string;
  onClick: () => void;
}

interface ExportButtonProps {
  options: ExportOption[];
  children?: React.ReactNode;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  options,
  children,
}) => {
  const { t } = useTranslation("global");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-[45px]">
          {children || t("modules.components.exportButton.defaultText")}
          <ChevronDown className="w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {options.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onClick={option.onClick}
            className={cn(
              "text-primary font-semibold rounded-none ",
              index !== 0 && "border-t-1 border-gray-200"
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
