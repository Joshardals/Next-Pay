"use client";
import { StatCard } from "../StatCard";
import { useState } from "react";
import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { BsCalendar4Week } from "react-icons/bs";
import { IoStatsChartOutline } from "react-icons/io5";

export function Performance() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const performanceData = {
    returns: [
      { period: "1D", value: -0.5, amount: -580.0 },
      { period: "1W", value: 2.1, amount: 2400.0 },
      { period: "1M", value: 5.8, amount: 6380.0 },
      { period: "3M", value: 12.4, amount: 12800.0 },
      { period: "YTD", value: 18.2, amount: 18600.0 },
      { period: "1Y", value: 24.5, amount: 228000.0 },
    ],
    topPerformers: [
      { symbol: "AAPL", return: 32.5, contribution: 8.2 },
      { symbol: "MSFT", return: 28.4, contribution: 6.8 },
      { symbol: "NVDA", return: 45.2, contribution: 5.4 },
    ],
    underPerformers: [
      { symbol: "META", return: -12.4, contribution: -2.8 },
      { symbol: "NFLX", return: -8.6, contribution: -1.9 },
      { symbol: "PYPL", return: -15.2, contribution: -1.2 },
    ],
  };

  return (
    <div className="px-2 md:px-4 max-md:py-12 xl:p-6 max-w-[1920px] mx-auto">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-medium text-snow mb-2">
          Portfolio Performance
        </h1>
        <p className="text-sm md:text-base text-lightGray">
          Track your investment performance and analyze returns
        </p>
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard
          title="Total Return"
          value="$228,000.00"
          trend="+24.5%"
          icon={<BiTrendingUp size={20} />}
        />
        <StatCard
          title="Daily Change"
          value="$-580.00"
          trend="-0.5%"
          icon={<BiTrendingDown size={20} />}
          trendDown
        />
        <StatCard
          title="Best Day"
          value="$12,400.00"
          subValue="Mar 15, 2024"
          icon={<BsCalendar4Week size={20} />}
        />
        <StatCard
          title="Sharpe Ratio"
          value="1.8"
          subValue="Good Risk-Adjusted Return"
          icon={<IoStatsChartOutline size={20} />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Performance Chart Section */}
        <div className="xl:col-span-2 bg-darkCharcoal rounded-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <h2 className="text-lg md:text-xl font-medium text-snow">
              Return Analysis
            </h2>
            <div className="flex flex-wrap gap-2">
              {performanceData.returns.map((period) => (
                <button
                  key={period.period}
                  onClick={() => setSelectedTimeframe(period.period)}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors
                    ${
                      selectedTimeframe === period.period
                        ? "bg-charcoal text-snow"
                        : "text-lightGray hover:bg-charcoal/50"
                    }`}
                >
                  {period.period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-[300px] md:h-[400px] bg-charcoal/30 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-sm md:text-base text-lightGray">
              Performance Chart
            </span>
          </div>

          {/* Period Returns Table */}
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[600px] md:w-full px-4 md:px-0">
              <table className="w-full">
                <thead>
                  <tr className="text-lightGray text-xs md:text-sm border-b border-darkGray/20">
                    <th className="text-left pb-4">Period</th>
                    <th className="text-right pb-4">Return %</th>
                    <th className="text-right pb-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.returns.map((period) => (
                    <tr
                      key={period.period}
                      className="border-b border-darkGray/10 hover:bg-charcoal/30 transition-colors"
                    >
                      <td className="py-3 md:py-4 text-sm md:text-base text-snow">
                        {period.period}
                      </td>
                      <td
                        className={`py-3 md:py-4 text-right text-sm md:text-base ${
                          period.value >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {period.value >= 0 ? "+" : ""}
                        {period.value}%
                      </td>
                      <td
                        className={`py-3 md:py-4 text-right text-sm md:text-base ${
                          period.amount >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ${Math.abs(period.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Metrics Section */}
        <div className="space-y-4 md:space-y-6">
          {/* Top Performers */}
          <div className="bg-darkCharcoal rounded-xl p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-medium text-snow mb-4">
              Top Performers
            </h2>
            {performanceData.topPerformers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between py-3 border-b border-darkGray/10 last:border-0"
              >
                <span className="text-sm md:text-base text-snow">
                  {stock.symbol}
                </span>
                <div className="text-right">
                  <div className="text-sm md:text-base text-green-400">
                    +{stock.return}%
                  </div>
                  <div className="text-xs md:text-sm text-lightGray">
                    +{stock.contribution}% contrib.
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Underperformers */}
          <div className="bg-darkCharcoal rounded-xl p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-medium text-snow mb-4">
              Underperformers
            </h2>
            {performanceData.underPerformers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between py-3 border-b border-darkGray/10 last:border-0"
              >
                <span className="text-sm md:text-base text-snow">
                  {stock.symbol}
                </span>
                <div className="text-right">
                  <div className="text-sm md:text-base text-red-400">
                    {stock.return}%
                  </div>
                  <div className="text-xs md:text-sm text-lightGray">
                    {stock.contribution}% contrib.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
