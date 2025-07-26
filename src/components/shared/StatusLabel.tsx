import { addOpacity } from "@/helpers/colors";
import { cn } from "@/lib/utils";

interface StatusLabelProps {
  value: string;
  color?: string;
  size?: "sm" | "md" | "lg"; // you can expand as needed
  className?: string;
}
const sizeClasses: Record<NonNullable<StatusLabelProps["size"]>, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

const StatusLabel = ({
  value,
  color = "#000000",
  size = "md",
  className = "",
}: StatusLabelProps) => {
  return (
    <div
      className={cn(
        "font-semibold w-fit cursor-default rounded-md border-1 capitalize",
        sizeClasses[size],
        className
      )}
      style={{
        color,
        borderColor: addOpacity(color, 0.2),
        backgroundColor: addOpacity(color, 0.1),
      }}
      title={value}
    >
      {value}
    </div>
  );
};

export default StatusLabel;
