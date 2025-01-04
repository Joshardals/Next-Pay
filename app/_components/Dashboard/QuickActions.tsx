import { BiDownload } from "react-icons/bi";
import { FiMinus } from "react-icons/fi";
import { ActionCard } from "./ActionCard";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <ActionCard
        title="Stock Holdings"
        badge="NYSE"
        value="127 Shares"
        subValue="≈ $1,110,000.00 USD"
        buttonText="Invest"
        buttonIcon={BiDownload}
        variant="primary"
      />
      <ActionCard
        title="Profit Available"
        badge="USD"
        value="+$100,000.00"
        subValue="Available for withdrawal"
        buttonText="Withdraw"
        buttonIcon={FiMinus}
        variant="secondary"
      />
    </div>
  );
}
