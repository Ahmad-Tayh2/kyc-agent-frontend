import type { ReactElement } from "react";

export default function Card(props: CardProps) {
  const { title, sideComponent, children } = props;
  return (
    <div className="bg-white flex flex-col rounded-md h-full w-full">
      <div className="flex justify-between items-center p-5 border-b-2">
        <div className="font-semibold">{title}</div>
        <div>{sideComponent}</div>
      </div>
      {children}
    </div>
  );
}

interface CardProps {
  title?: string;
  titleNote?: string;
  sideComponent?: ReactElement | string;
  children: ReactElement;
}
