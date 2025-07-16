import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  active?: boolean;
  children?: React.ReactNode;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  active = false,
  children,
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={active ? "bg-primary/10 border-primary" : ""}
    >
      <Filter className="h-4 w-4 mr-2" />
      {children || "Filters"}
    </Button>
  );
};
