import { BsThreeDots } from "react-icons/bs";
import { AccountSetupProgress } from "./AccountSetupProgress";
import { ChatSupport } from "./ChatSupport";
import { QuickActions } from "./QuickActions";
import { QuickStats } from "./QuickStats";
import { StockChart } from "./StockChart";

export function Home() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 px-4 py-6 xl:p-6 max-w-[1920px] mx-auto">
      <div className="flex-1 flex flex-col gap-6 min-w-0 order-2 xl:order-1">
        <div className="flex justify-between items-start gap-4 mb-2 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium text-snow mb-2">
              Welcome back, Ian
            </h1>
            <p className="text-lightGray text-sm">Last login: Today, 9:45 AM</p>
          </div>
          <button
            title="more options"
            className="p-2 hover:bg-darkCharcoal rounded-xl transition-all"
          >
            <BsThreeDots className="text-lightGray" size={20} />
          </button>
        </div>

        <QuickStats />
        <StockChart />
        <QuickActions />
      </div>
      <div className="flex flex-col gap-6 w-full xl:w-80 order-1">
        <AccountSetupProgress />
        <ChatSupport />
      </div>
    </div>
  );
}
