import type { ReactElement } from "react";

interface StatLineProps {
  title?: ReactElement | string;
  value?: ReactElement | string;
}
const StatLine = (props: StatLineProps) => {
  const { title, value } = props;
  return (
    <div className="flex items-center justify-between flex-1 border-b-1 px-5">
      <div>{title}</div>
      <div>{value}</div>
    </div>
  );
};

export default StatLine;
