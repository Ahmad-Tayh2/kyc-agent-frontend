import Card from "./Card";
import StatLine from "./StatLine";

export default function Transfers() {
  return (
    <div className="h-full ">
      <Card title="Transfers" sideComponent={<div>USD</div>}>
        <div className="overflow-auto">
          <StatLine title={<StatStatus />} value="109" />
          <StatLine title={<StatStatus />} value="109" />
          <StatLine title={<StatStatus />} value="109" />
          <StatLine title={<StatStatus />} value="109" />
        </div>
      </Card>
    </div>
  );
}

const StatStatus = () => {
  return (
    <div className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full">
      In-Progress
    </div>
  );
};
