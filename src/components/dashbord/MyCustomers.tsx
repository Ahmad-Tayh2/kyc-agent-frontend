import Card from "./Card";
import StatLine from "./StatLine";

export default function MyCustomers() {
  return (
    <div className="h-full ">
      <Card title="My Customers">
        <div className="overflow-auto">
          <StatLine title="Total Customers" value="150" />
          <StatLine title="Total Customers" value="150" />
          <StatLine title="Total Customers" value="150" />
          <StatLine title="Total Customers" value="150" />
        </div>
      </Card>
    </div>
  );
}
