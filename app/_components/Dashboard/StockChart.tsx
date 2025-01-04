"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

const SYMBOL = "TSLA";
const CACHE_DURATION = {
  "24H": 5 * 60 * 1000, // 5 minutes
  "1W": 30 * 60 * 1000, // 30 minutes
  "1M": 60 * 60 * 1000, // 1 hour
  "1Y": 24 * 60 * 60 * 1000, // 24 hours
  ALL: 24 * 60 * 60 * 1000, // 24 hours
};

type TimeFrame = "24H" | "1W" | "1M" | "1Y" | "ALL";

interface StockData {
  time: Date;
  price: number;
  volume: number;
}

interface CacheEntry {
  data: StockData[];
  timestamp: number;
}

interface AlphaVantageResponse {
  "Time Series (5min)"?: {
    [key: string]: {
      "4. close": string;
      "5. volume": string;
    };
  };
  "Time Series (Daily)"?: {
    [key: string]: {
      "4. close": string;
      "5. volume": string;
    };
  };
  Note?: string;
  "Error Message"?: string;
}

const cache: Record<TimeFrame, CacheEntry | null> = {
  "24H": null,
  "1W": null,
  "1M": null,
  "1Y": null,
  ALL: null,
};

class RateLimiter {
  private lastRequest: number = 0;
  private requestQueue: (() => void)[] = [];
  private processing: boolean = false;

  async enqueue(fn: () => Promise<void>): Promise<void> {
    return new Promise((resolve) => {
      this.requestQueue.push(async () => {
        await fn();
        resolve();
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return;

    this.processing = true;
    const now = Date.now();
    const timeToWait = Math.max(0, this.lastRequest + 12000 - now);

    await new Promise((resolve) => setTimeout(resolve, timeToWait));

    const nextRequest = this.requestQueue.shift();
    if (nextRequest) {
      this.lastRequest = Date.now();
      await nextRequest();
    }

    this.processing = false;
    this.processQueue();
  }
}

const rateLimiter = new RateLimiter();

const getApiEndpoint = (timeFrame: TimeFrame) => {
  switch (timeFrame) {
    case "24H":
      return `function=TIME_SERIES_INTRADAY&interval=5min`;
    case "1W":
    case "1M":
    case "1Y":
    case "ALL":
      return `function=TIME_SERIES_DAILY`;
    default:
      return `function=TIME_SERIES_INTRADAY&interval=5min`;
  }
};

const getDataPoints = (timeFrame: TimeFrame): number => {
  switch (timeFrame) {
    case "24H":
      return 24;
    case "1W":
      return 7;
    case "1M":
      return 30;
    case "1Y":
      return 365;
    case "ALL":
      return 1000;
    default:
      return 24;
  }
};

async function fetchStockData(
  timeFrame: TimeFrame
): Promise<StockData[] | null> {
  // Check cache first
  const cached = cache[timeFrame];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION[timeFrame]) {
    return cached.data;
  }

  return new Promise((resolve) => {
    rateLimiter.enqueue(async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
        if (!apiKey) {
          throw new Error("API key is missing");
        }

        const endpoint = getApiEndpoint(timeFrame);
        const url = `https://www.alphavantage.co/query?${endpoint}&symbol=${SYMBOL}&apikey=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as AlphaVantageResponse;

        if (data["Error Message"]) {
          throw new Error(data["Error Message"]);
        }

        if (data["Note"]) {
          console.warn("API Note:", data["Note"]);
        }

        const timeSeriesData =
          timeFrame === "24H"
            ? data["Time Series (5min)"]
            : data["Time Series (Daily)"];

        if (!timeSeriesData || Object.keys(timeSeriesData).length === 0) {
          throw new Error("No data available");
        }

        const formattedData = Object.entries(timeSeriesData).map(
          ([timestamp, values]) => ({
            time: new Date(timestamp),
            price: parseFloat(values["4. close"]),
            volume: parseInt(values["5. volume"]),
          })
        );

        if (formattedData.length === 0) {
          throw new Error("No data points after formatting");
        }

        const sortedData = formattedData
          .sort((a, b) => a.time.getTime() - b.time.getTime())
          .slice(-getDataPoints(timeFrame));

        // Update cache
        cache[timeFrame] = {
          data: sortedData,
          timestamp: Date.now(),
        };

        resolve(sortedData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        resolve(null);
      }
    });
  });
}

export function StockChart() {
  const [chartData, setChartData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("24H");

  const loadData = async (timeFrame: TimeFrame) => {
    setIsLoading(true);
    try {
      const data = await fetchStockData(timeFrame);
      if (data) {
        setChartData(data);
        setError(null);
      } else {
        throw new Error("Failed to load stock data");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedTimeFrame);

    const interval = setInterval(() => {
      loadData(selectedTimeFrame);
    }, CACHE_DURATION[selectedTimeFrame]);

    return () => clearInterval(interval);
  }, [selectedTimeFrame]);

  const handleTimeFrameChange = (timeFrame: TimeFrame) => {
    setSelectedTimeFrame(timeFrame);
  };

  if (isLoading && chartData.length === 0) {
    return (
      <div className="bg-charcoal rounded-2xl p-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-snow">Loading TSLA stock data...</div>
        </div>
      </div>
    );
  }

  if (error && chartData.length === 0) {
    return (
      <div className="bg-charcoal rounded-2xl p-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-snow">Error loading stock data: {error}</div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-charcoal rounded-2xl p-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-snow">No data available</div>
        </div>
      </div>
    );
  }

  const currentPrice = chartData[chartData.length - 1]?.price ?? 0;
  const startPrice = chartData[0]?.price ?? 0;
  const priceChange = currentPrice - startPrice;
  const percentageChange = (priceChange / startPrice) * 100;
  const isPositive = priceChange >= 0;

  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  const chartPoints = chartData
    .map((point, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = 100 - ((point.price - minPrice) / priceRange) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const timeFrames: TimeFrame[] = ["24H", "1W", "1M", "1Y", "ALL"];

  return (
    <div className="bg-charcoal rounded-2xl p-6 max-md:p-4">
      <div className="flex flex-col max-md:gap-4 md:flex-row md:justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-snow font-medium">TSLA</h3>
            <span
              className={`px-2 py-0.5 ${
                isPositive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              } text-xs font-medium rounded-lg`}
            >
              {isPositive ? "+" : ""}
              {percentageChange.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl max-md:text-xl font-semibold text-snow">
              ${currentPrice.toFixed(2)}
            </p>
            <span className="text-xs text-lightGray">TSLA/USD</span>
          </div>
        </div>

        <div className="flex max-md:w-full overflow-x-auto gap-1 bg-darkCharcoal rounded-xl p-1">
          {timeFrames.map((timeFrame) => (
            <button
              key={timeFrame}
              onClick={() => handleTimeFrameChange(timeFrame)}
              className={`px-4 py-2 text-sm max-md:text-xs rounded-lg transition-all duration-200 whitespace-nowrap
                ${
                  selectedTimeFrame === timeFrame
                    ? "bg-charcoal text-snow"
                    : "text-lightGray hover:text-snow hover:bg-charcoal/50"
                }`}
            >
              {timeFrame}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] max-md:h-[300px] w-full bg-darkCharcoal rounded-xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-darkCharcoal/50 flex items-center justify-center z-10">
            <div className="text-snow">Updating...</div>
          </div>
        )}

        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="border-r border-t border-darkGray/10" />
          ))}
        </div>

        <svg
          className="w-full h-full p-4 max-md:p-2"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points={chartPoints}
            fill="none"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />

          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={isPositive ? "#22c55e" : "#ef4444"}
              stopOpacity="0.2"
            />
            <stop
              offset="100%"
              stopColor={isPositive ? "#22c55e" : "#ef4444"}
              stopOpacity="0"
            />
          </linearGradient>
          <polyline
            points={`${chartPoints} 100,100 0,100`}
            fill="url(#gradient)"
          />
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-2 text-xs max-md:text-[10px] text-lightGray">
          {chartData
            .filter((_, i) => i % (window.innerWidth <= 768 ? 12 : 6) === 0)
            .map((point, i) => (
              <span key={i}>
                {format(
                  point.time,
                  selectedTimeFrame === "24H" ? "HH:mm" : "MMM dd"
                )}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
