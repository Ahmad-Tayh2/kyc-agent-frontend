import SearchNotFoundIcon from "@/assets/icons/search-not-found.svg?react";
import ActionButton from "./ActionButton";
import type { ReactNode } from "react";
interface SearchNotFound {
  description: string;
  actionButton?: {
    title?: string;
    icon?: ReactNode;
    className?: string;
    onClick?: any;
    buttonProps?: any;
  };
}
export default function SearchNotFound(props: SearchNotFound) {
  const { description, actionButton } = props;
  return (
    <div className="p-5 h-80 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center gap-5">
        <div>
          <SearchNotFoundIcon />
        </div>
        {description && <div className="w-[300px]">{description}</div>}
      </div>
      {actionButton && <ActionButton {...actionButton} />}
    </div>
  );
}
