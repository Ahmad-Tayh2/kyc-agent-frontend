import React from "react";
import { Link } from "react-router-dom";

export default function LinkList(props: LinkListProps) {
  const { data } = props;
  return (
    <div>
      {data?.map((item: DataItem, index: number) => {
        if (item?.link) {
          return (
            <React.Fragment key={index}>
              {index !== 0 && ", "}
              <Link
                to={item?.link}
                className="font-medium text-xs hover:underline"
              >
                {item?.label}
              </Link>
            </React.Fragment>
          );
        } else {
          return (
            <span>
              {index !== 0 && ", "}
              {item?.label}
            </span>
          );
        }
      })}
    </div>
  );
}
interface DataItem {
  label: string;
  link?: string;
}
interface LinkListProps {
  data: DataItem[];
}
