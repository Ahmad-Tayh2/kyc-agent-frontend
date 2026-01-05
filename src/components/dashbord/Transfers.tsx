import Card from "./Card";
import StatLine from "./StatLine";

export default function Transfers() {
  return (
    <div className="h-full ">
      <Card title="Transfers" sideComponent={<div>USD</div>}>
        <div className="flex flex-col justify-center flex-1">
          <StatLine title={<StatStatus />} value="109" />
          <StatLine title={<StatStatus />} value="110" />
          <StatLine title={<StatStatus />} value="111" />
          <StatLine title={<StatStatus />} value="112" />
          <StatLine title={<StatStatus />} value="113" />
        </div>
      </Card>
    </div>
  );
}

const StatStatus = () => {
  return (
    <div className="bg-amber-100 text-sm sm:text-md text-amber-700 py-0 sm:py-1 px-3 rounded-full">
      In-Progress
    </div>
  );
};
