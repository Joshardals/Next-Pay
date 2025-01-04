import { StatCard } from "./StatCard";

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Total Balance" value="$60,000.00" trend="+2.5%" />
      <StatCard
        title="Stock Holdings"
        value="127 Shares"
        subValue="≈ $1,110,000.00"
      />
      <StatCard
        title="Available Cash"
        value="-$50,000.00"
        subValue="Current overdraft"
        type="overdraft"
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}
