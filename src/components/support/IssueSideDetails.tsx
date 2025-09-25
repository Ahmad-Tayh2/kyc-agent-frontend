export default function IssueSideDetails() {
  return (
    <div className="w-4/9 bg-white p-5">
      <div className="flex flex-col gap-8">
        <DetailsItem title={"Type"} description={"Money Withdrawal"} />
        <DetailsItem title={"date"} description={"20-05-2016"} />
        <DetailsItem
          title={"Summary"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco"
          }
        />
        <DetailsItem title={"Attachments"} description={""} />

        <DetailsItem title={"Resolution"} description={""} />
      </div>
    </div>
  );
}

interface DetailsItemProps {
  title?: string;
  description?: string;
}
const DetailsItem = (props: DetailsItemProps) => {
  const { title, description } = props;
  return (
    <div className="flex flex-col gap-2">
      <div className="uppercase text-[#656565]">{title}</div>
      <div>{description}</div>
    </div>
  );
};
