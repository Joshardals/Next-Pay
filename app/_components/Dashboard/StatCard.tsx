import { IoTrendingUpSharp } from "react-icons/io5";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: string;
  type?: "default" | "overdraft";
  className?: string;
  icon?: React.ReactNode;
  trendDown?: boolean;
}

export function StatCard({
  title,
  value,
  subValue,
  trend,
  type = "default",
  className = "",
  icon,
  trendDown = false,
}: StatCardProps) {
  return (
    <div
      className={`bg-darkCharcoal rounded-xl p-4 relative overflow-hidden ${className}`}
    >
      {type === "overdraft" && (
        <div className="absolute top-0 right-0 bg-darkCharcoal/60 p-1 px-2 rounded-bl-xl">
          <span className="text-xs text-goldenrod">Overdraft</span>
        </div>
      )}
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm text-lightGray">{title}</p>
        {icon && <span className="text-lightGray">{icon}</span>}
      </div>
      <h2
        className={`text-2xl font-semibold ${
          type === "overdraft" ? "text-goldenrod/90" : "text-snow"
        }`}
      >
        {value}
      </h2>
      {trend ? (
        <div className="flex items-center gap-1 mt-1">
          <IoTrendingUpSharp
            className={trendDown ? "text-red-400 rotate-180" : "text-green-400"}
            size={14}
          />
          <span
            className={`text-xs ${
              trendDown ? "text-red-400" : "text-green-400"
            }`}
          >
            {trend}
          </span>
          <span className="text-xs text-lightGray">24h</span>
        </div>
      ) : (
        <p className="text-xs text-lightGray mt-1">{subValue}</p>
      )}
    </div>
  );
}
