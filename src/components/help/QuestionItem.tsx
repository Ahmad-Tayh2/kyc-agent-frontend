import { cn } from "@/lib/utils";
import ShowLessIcon from "@/assets/icons/show-less.svg?react";
import ShowMoreIcon from "@/assets/icons/show-more.svg?react";
import { useState } from "react";
interface QuestionItemProps {
  title?: string;
  description?: string;
}
export const QuestionItem = (props: QuestionItemProps) => {
  const { title, description } = props;
  const [opened, setOpened] = useState(false);
  return (
    <div
      className={cn(
        "flex items-start justify-between w-full gap-5 p-5 rounded-md",
        opened ? "bg-gray-100" : "hover:bg-gray-100"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="text-[18px]">{title}</div>
        {opened && <div className="text-[14px]">{description}</div>}
      </div>
      <div
        className="cursor-pointer rounded-full"
        onClick={() => setOpened((prev: boolean) => !prev)}
      >
        {opened ? <ShowLessIcon /> : <ShowMoreIcon />}
      </div>
    </div>
  );
};
