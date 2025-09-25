import Card from "./Card";
import StatCard from "./StatCard";

export default function Issues() {
  return (
    <div className="h-full ">
      <Card title="Issues" sideComponent={<div>USD</div>}>
        <div className="flex flex-col justify-evenly  h-full gap-3 p-5">
          <StatCard className="bg-amber-50" />
          <StatCard className="bg-green-50" />
          <StatCard className="bg-red-50" />
        </div>
      </Card>
    </div>
  );
}
