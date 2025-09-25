import { cn } from "@/lib/utils";

const StatCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        className,
        "py-2 px-5 rounded-md flex flex-1 items-center justify-center gap-2"
      )}
    >
      <span className="font-semibold">150</span>
      <span>Non-Resolved Issues</span>
    </div>
  );
};

export default StatCard;
