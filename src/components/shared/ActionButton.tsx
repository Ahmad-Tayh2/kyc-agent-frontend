import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  title?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: any;
  buttonProps?: any;
  type?: "link" | "cancel" | "action";
}
export default function ActionButton(props: ActionButtonProps) {
  const {
    title = "button",
    type = "action",
    icon,
    className,
    onClick,
    ...buttonProps
  } = props;
  let baseClass = "text-[13px] uppercase cursor-pointer w-fit p-5 ";
  if (type === "link") {
    baseClass += "text-primary bg-transparent ";
  } else if (type === "cancel") {
    baseClass +=
      "border-2 border-primary text-primary bg-white hover:bg-primary/5";
  } else {
    baseClass += "border-b-2 border-t-2 border-t-[#31dada] border-b-[#149393]";
  }
  return (
    <Button
      variant={type === "link" ? "link" : "default"}
      className={cn(baseClass, className)}
      onClick={onClick}
      {...buttonProps}
    >
      {icon && <span>{icon}</span>}
      <span>{title}</span>
    </Button>
  );
}
