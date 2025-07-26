import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation("global");
  const defaultPlaceholder = placeholder || t("modules.components.searchInput.defaultPlaceholder");
  
  return (
    <div className={cn("relative min-w-4 w-[316px]", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4  text-gray-400" />
      <Input
        type="text"
        placeholder={defaultPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-[40px] w-full bg-white"
      />
    </div>
  );
};
