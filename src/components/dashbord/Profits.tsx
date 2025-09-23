import Card from "./Card";
import StatLine from "./StatLine";

export default function Profits() {
  return (
    <div className="h-full ">
      <Card title="My Profits" sideComponent={<div>USD</div>}>
        <div className="overflow-auto">
          <StatLine title="Today" value="$100" />
          <StatLine title="Yesterday" value="$220" />
          <StatLine title="This Month" value="$520" />
          <StatLine title="Last Month" value="$1230" />
        </div>
      </Card>
    </div>
  );
}
