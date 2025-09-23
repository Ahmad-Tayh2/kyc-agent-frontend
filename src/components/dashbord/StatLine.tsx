import type { ReactElement } from "react";

interface StatLineProps {
  title?: ReactElement | string;
  value?: ReactElement | string;
}
const StatLine = (props: StatLineProps) => {
  const { title, value } = props;
  return (
    <div className="flex items-center justify-between p-5 border-b-1">
      <div>{title}</div>
      <div className="font-semibold text-primary">{value}</div>
    </div>
  );
};

export default StatLine;
