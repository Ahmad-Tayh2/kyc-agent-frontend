import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

// export interface SummaryData {

// }

interface SummaryCardProps {
  title?: string;
  data?: any;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  data,
  className = "",
}) => {
  return (
    <div
      className={`bg-[#E4F2F2] rounded-lg border p-6 space-y-4 sticky top-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <hr />

      <div className="space-y-3 text-sm">
        {data?.map((item: any, index: number) => (
          <>
            {index !== 0 && <hr className="my-3" />}
            <div className={cn("flex justify-between", item.className)}>
              <div
                className={cn(
                  "text-gray-600 flex items-center",
                  item.labelClassName
                )}
              >
                <span>{item?.label}</span>
                {item.info && <Info className="w-3 h-3 ml-1 text-gray-400" />}
              </div>
              <div className={cn("font-medium", item.labelClassName)}>
                {item?.value}
              </div>
            </div>
          </>
        ))}

        {/* <hr className="my-3" />

        <div className="flex justify-between ">
          <div>Total Payable Amount</div>
          <div>{data?.totalPayableAmount}</div>
        </div> */}
      </div>
    </div>
  );
};

export default SummaryCard;
