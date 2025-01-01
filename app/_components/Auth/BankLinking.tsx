"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FormInput, Button } from "../Form/FormInput";

// Expanded bank list with major banks and credit unions
const BANKS = [
  { name: "Avandian Credit Union", id: "avandian_cu" },
  { name: "Chase", id: "chase" },
  { name: "Bank of America", id: "boa" },
  { name: "Wells Fargo", id: "wellsfargo" },
  { name: "Citibank", id: "citi" },
  { name: "Capital One", id: "capitalone" },
  { name: "US Bank", id: "usbank" },
  { name: "PNC Bank", id: "pnc" },
  { name: "TD Bank", id: "tdbank" },
  { name: "Truist Bank", id: "truist" },
  { name: "Navy Federal Credit Union", id: "navyfcu" },
  { name: "USAA", id: "usaa" },
  { name: "Discover Bank", id: "discover" },
  { name: "Goldman Sachs", id: "goldman" },
  { name: "Charles Schwab Bank", id: "schwab" },
  { name: "Ally Bank", id: "ally" },
  { name: "Citizens Bank", id: "citizens" },
  { name: "Fifth Third Bank", id: "fifththird" },
  { name: "KeyBank", id: "keybank" },
  { name: "Regions Bank", id: "regions" },
].sort((a, b) => a.name.localeCompare(b.name));

interface BankingInfo {
  bankId: string;
  accountNumber: string;
  routingNumber: string;
  accountName: string;
}

export function BankLinking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const filteredBanks = BANKS.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBankSelect = (bank: (typeof BANKS)[0]) => {
    setSelectedBank(bank.id);
    setSearchTerm(bank.name);
    setShowBankList(false);
  };

  const handleSearchFocus = () => {
    setShowBankList(true);
  };

  const validateRoutingNumber = (routingNumber: string): boolean => {
    if (!/^\d{9}$/.test(routingNumber)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(routingNumber[i]) * [7, 3, 9, 7, 3, 9, 7, 3, 9][i];
    }
    return sum % 10 === 0;
  };

  const validateAccountNumber = (accountNumber: string): boolean => {
    return /^\d{8,17}$/.test(accountNumber);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const accountNumber = formData.get("accountNumber") as string;
    const routingNumber = formData.get("routingNumber") as string;
    const accountName = formData.get("accountName") as string;

    try {
      if (!user) throw new Error("No user found");
      if (!selectedBank) throw new Error("Please select a bank");
      if (!validateRoutingNumber(routingNumber)) {
        throw new Error("Invalid routing number");
      }
      if (!validateAccountNumber(accountNumber)) {
        throw new Error("Invalid account number");
      }
      if (accountName.trim().length < 2) {
        throw new Error("Please enter a valid account holder name");
      }

      const bankingInfo: BankingInfo = {
        bankId: selectedBank,
        accountNumber,
        routingNumber,
        accountName: accountName.trim(),
      };

      await updateDoc(doc(db, "users", user.uid), {
        bankingInfo,
        bankingInfoSubmittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });

      router.push("/dashboard/verification-pending");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex flex-col items-center min-h-screen px-4 text-[#E4E4E4] mb-14">
      <div className="w-full max-w-md space-y-8">
        <div className="w-full rounded">
          <h1 className="text-2xl font-bold mb-6">Link Your Bank Account</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Select Your Bank
                </label>
                <input
                  type="text"
                  placeholder="Search for your bank..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowBankList(true);
                    if (!e.target.value) {
                      setSelectedBank("");
                    }
                  }}
                  disabled={isLoading}
                  onFocus={handleSearchFocus}
                  className="w-full p-3 rounded bg-[#1A1A1A] border border-[#333333] focus:border-goldenrod placeholder:text-[#9B9B9B]/70 focus:outline-none"
                />

                {showBankList && searchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1A1A1A] border border-[#333333] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <div
                          key={bank.id}
                          className="p-3 cursor-pointer hover:bg-[#2D2D2D] transition-colors duration-200"
                          onClick={() => handleBankSelect(bank)}
                        >
                          {bank.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-400">No banks found</div>
                    )}
                  </div>
                )}
              </div>

              <FormInput
                name="accountName"
                label="Account Holder Name"
                placeholder="Enter Account Holder Name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                isLoading={isLoading}
                disabled={isLoading}
              />

              <FormInput
                name="accountNumber"
                label="Account Number"
                placeholder="Enter Account Number"
                type="text"
                required
                pattern="\d{8,17}"
                title="Account number must be between 8 and 17 digits"
                isLoading={isLoading}
                disabled={isLoading}
              />

              <FormInput
                name="routingNumber"
                label="Routing Number"
                placeholder="Enter 9-digit Routing Number"
                type="text"
                required
                pattern="\d{9}"
                title="Routing number must be exactly 9 digits"
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={!selectedBank || isLoading}
              >
                {isLoading ? "Linking Account..." : "Link Bank Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
