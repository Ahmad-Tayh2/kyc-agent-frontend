import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {children || "Export"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option, index) => (
          <DropdownMenuItem key={index} onClick={option.onClick}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
