interface PageTitleProps {
  title: string;
}
export default function PageTitle(props: PageTitleProps) {
  const { title } = props;
  return <h1 className="text-[24px] font-bold">{title}</h1>;
}
