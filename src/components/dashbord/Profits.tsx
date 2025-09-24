import Card from "./Card";
import StatLine from "./StatLine";

export default function Profits() {
  return (
    <div className="h-full ">
      <Card title="My Profits" sideComponent={<div>USD</div>}>
        <div className="flex flex-col justify-center flex-1">
          <StatLine
            title="Today"
            value={<span className="font-semibold text-primary">$100</span>}
          />
          <StatLine
            title="Yesterday"
            value={<span className="font-semibold text-primary">$100</span>}
          />
          <StatLine
            title="This Month"
            value={<span className="font-semibold text-primary">$100</span>}
          />
          <StatLine
            title="Last Month"
            value={<span className="font-semibold text-primary">$100</span>}
          />
          <StatLine
            title="Year Till Date"
            value={<span className="font-semibold text-primary">$100</span>}
          />
        </div>
      </Card>
    </div>
  );
}
