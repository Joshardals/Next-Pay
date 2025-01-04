"use client";
import { StatCard } from "../StatCard";
import { IoWalletOutline } from "react-icons/io5";
import { BsBank2, BsShield, BsGear } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { JSX, useState } from "react";

export function AccountPage() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const stockHoldings = [
    { symbol: "AAPL", shares: 50, value: 8250.0, change: "+2.5%" },
    { symbol: "TSLA", shares: 30, value: 7500.0, change: "-1.2%" },
    { symbol: "MSFT", shares: 25, value: 8750.0, change: "+3.1%" },
    { symbol: "GOOGL", shares: 15, value: 12000.0, change: "+0.8%" },
    { symbol: "AMZN", shares: 20, value: 6800.0, change: "-0.5%" },
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case "deposit":
        setShowDepositModal(true);
        break;
      case "bank":
        setShowBankModal(true);
        break;
      case "security":
        setShowSecurityModal(true);
        break;
      case "statements":
        window.open("/statements", "_blank");
        break;
      case "preferences":
        window.location.href = "/preferences";
        break;
    }
  };

  return (
    <div className="px-4 py-12 xl:p-6 max-w-[1920px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-snow mb-2">
          Account Overview
        </h1>
        <p className="text-lightGray">
          Manage your account settings and view your financial summary
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Portfolio Value"
          value="$1,160,000.00"
          trend="+2.8%"
        />
        <StatCard
          title="Available Cash"
          value="$50,000.00"
          subValue="Ready to invest"
        />
        <StatCard title="Total Profit/Loss" value="+$160,000.00" trend="+16%" />
        <StatCard
          title="Account Level"
          value="Premium"
          subValue="Since Jan 2024"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stock Holdings Section */}
        <div className="xl:col-span-2 bg-darkCharcoal rounded-xl p-4 md:p-6">
          <h2 className="text-xl font-medium text-snow mb-4">Stock Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-lightGray text-sm border-b border-darkGray/20">
                  <th className="text-left pb-4">Symbol</th>
                  <th className="text-right pb-4">Shares</th>
                  <th className="text-right pb-4">Market Value</th>
                  <th className="text-right pb-4">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {stockHoldings.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="border-b border-darkGray/10 hover:bg-charcoal/30 transition-colors"
                  >
                    <td className="py-4 text-snow font-medium">
                      {stock.symbol}
                    </td>
                    <td className="py-4 text-right text-lightGray">
                      {stock.shares}
                    </td>
                    <td className="py-4 text-right text-snow">
                      ${stock.value.toLocaleString()}
                    </td>
                    <td
                      className={`py-4 text-right ${
                        stock.change.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {stock.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-4">
          {/* Account Management Cards */}
          <div className="bg-darkCharcoal rounded-xl p-4 md:p-6">
            <h2 className="text-xl font-medium text-snow mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickActionButton
                icon={<IoWalletOutline size={20} />}
                label="Deposit Funds"
                onClick={() => handleAction("deposit")}
              />
              <QuickActionButton
                icon={<BsBank2 size={20} />}
                label="Link Bank"
                onClick={() => handleAction("bank")}
              />
              <QuickActionButton
                icon={<HiOutlineDocumentText size={20} />}
                label="Statements"
                onClick={() => handleAction("statements")}
              />
              <QuickActionButton
                icon={<BsShield size={20} />}
                label="Security"
                onClick={() => handleAction("security")}
              />
              <QuickActionButton
                icon={<BsGear size={20} />}
                label="Preferences"
                onClick={() => handleAction("preferences")}
              />
            </div>
          </div>

          {/* Verification Level Card */}
          <div className="bg-darkCharcoal rounded-xl p-4 md:p-6">
            <h2 className="text-xl font-medium text-snow mb-4">
              Verification Level
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lightGray">Current Level</span>
              <span className="text-goldenrod font-medium">Level 2</span>
            </div>
            <div className="h-2 bg-charcoal rounded-full mb-4">
              <div className="h-full w-2/3 bg-gradient-to-r from-goldenrod to-yellow-400 rounded-full"></div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-charcoal text-snow hover:bg-charcoal/80 transition-colors text-sm">
              Upgrade Level
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDepositModal && (
        <Modal onClose={() => setShowDepositModal(false)}>
          <h2 className="text-xl font-medium text-snow mb-4">Deposit Funds</h2>
          {/* Add deposit form here */}
        </Modal>
      )}

      {showBankModal && (
        <Modal onClose={() => setShowBankModal(false)}>
          <h2 className="text-xl font-medium text-snow mb-4">
            Link Bank Account
          </h2>
          {/* Add bank linking form here */}
        </Modal>
      )}

      {showSecurityModal && (
        <Modal onClose={() => setShowSecurityModal(false)}>
          <h2 className="text-xl font-medium text-snow mb-4">
            Security Settings
          </h2>
          {/* Add security settings here */}
        </Modal>
      )}
    </div>
  );
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickActionButton({
  icon,
  label,
  onClick,
}: QuickActionButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-charcoal text-left transition-colors"
    >
      <span className="text-lightGray">{icon}</span>
      <span className="text-snow text-sm">{label}</span>
    </button>
  );
}

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ children, onClose }: ModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-darkCharcoal rounded-xl p-6 max-w-md w-full mx-4">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-lightGray hover:text-snow"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
