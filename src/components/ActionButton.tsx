import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  title?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: any;
  buttonProps?: any;
}
export default function ActionButton(props: ActionButtonProps) {
  const { title = "button", icon, className, onClick, ...buttonProps } = props;
  return (
    <Button
      className={cn(
        "text-[13px] uppercase cursor-pointer w-fit p-5 border-b-2 border-t-2 border-t-[#31dada] border-b-[#149393]",
        className
      )}
      onClick={onClick}
      {...buttonProps}
    >
      {icon && <span>{icon}</span>}
      <span>{title}</span>
    </Button>
  );
}
