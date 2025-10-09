import SearchNotFoundIcon from "@/assets/icons/search-not-found.svg?react";
import ActionButton from "./ActionButton";
import type { ReactNode } from "react";
interface SearchNotFound {
  found?: boolean;
  description?: string;
  actionButton?: {
    title?: string;
    icon?: ReactNode;
    className?: string;
    onClick?: any;
    buttonProps?: any;
  };
}
export default function SearchNotFound(props: SearchNotFound) {
  const { description, actionButton, found = false } = props;
  return (
    <div className="p-5 h-80 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center gap-5">
        {!found && (
          <div>
            <SearchNotFoundIcon />
          </div>
        )}
        {description && <div>{description}</div>}
      </div>
      {actionButton && <ActionButton {...actionButton} />}
    </div>
  );
}
