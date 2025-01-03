"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button, FormInput } from "../Form/FormInput";
import { toast } from "react-hot-toast";

const OVERDRAFT_LIMITS = [
  { label: "$20,000 - $50,000", value: "20k-50k" },
  { label: "$50,000 - $100,000", value: "50k-100k" },
  { label: "$500,000 and above", value: "500k+" },
];

export function OverdraftSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState<
    "overdraft" | "investment" | ""
  >("");
  const [selectedLimit, setSelectedLimit] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkVerificationSubmission = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      // Redirect to login if no user data
      if (!userData) {
        router.push("/login");
        return;
      }

      // Redirect to verification if verification info not submitted
      if (!userData?.verificationInfo) {
        router.push("/verification");
        return;
      }

      // Redirect to dashboard if overdraft/investment selection is already completed
      if (userData.overdraftType || userData.investmentAmount) {
        router.push("/dashboard");
        return;
      }
    };

    checkVerificationSubmission();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!user) throw new Error("No user found");

      const data =
        selectedOption === "overdraft"
          ? {
              overdraftType: "limit",
              overdraftLimit: selectedLimit,
              overdraftSelectionAt: new Date().toISOString(),
            }
          : {
              overdraftType: "investment",
              investmentAmount: parseFloat(investmentAmount),
              overdraftSelectionAt: new Date().toISOString(),
            };

      await updateDoc(doc(db, "users", user.uid), data);
      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex flex-col items-center min-h-screen px-4 text-[#E4E4E4]">
      <div className="w-full max-w-md space-y-8">
        <div className="w-full bg-[#1D1D1D] p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Investment Options</h1>
          <p className="text-[#9B9B9B] mb-8">
            Choose how you'd like to grow your wealth with us.
          </p>

          {!selectedOption ? (
            <div className="space-y-4">
              <div
                onClick={() => setSelectedOption("overdraft")}
                className="p-6 border border-[#333333] rounded-lg cursor-pointer hover:border-goldenrod hover:bg-[#2D2D2D] transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Overdraft Facility
                </h3>
                <p className="text-[#9B9B9B] text-sm">
                  Access premium overdraft limits with competitive rates
                </p>
              </div>

              <div
                onClick={() => setSelectedOption("investment")}
                className="p-6 border border-[#333333] rounded-lg cursor-pointer hover:border-goldenrod hover:bg-[#2D2D2D] transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-2">Stock Investment</h3>
                <p className="text-[#9B9B9B] text-sm">
                  Invest in stocks and let us manage your portfolio for optimal
                  returns
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
                  {error}
                </div>
              )}

              {selectedOption === "overdraft" ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Select Overdraft Limit
                  </h2>
                  {OVERDRAFT_LIMITS.map((limit) => (
                    <div
                      key={limit.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedLimit === limit.value
                          ? "border-goldenrod bg-[#2D2D2D]"
                          : "border-[#333333] hover:border-goldenrod hover:bg-[#2D2D2D]"
                      }`}
                      onClick={() => setSelectedLimit(limit.value)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          title="overdraftLimit"
                          name="overdraftLimit"
                          value={limit.value}
                          checked={selectedLimit === limit.value}
                          onChange={(e) => setSelectedLimit(e.target.value)}
                          className="mr-3"
                          required
                        />
                        <label className="cursor-pointer">{limit.label}</label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Enter Investment Amount
                  </h2>
                  <FormInput
                    name="investmentAmount"
                    label="Investment Amount (USD)"
                    type="number"
                    min="3000"
                    placeholder="Minimum $3,000"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    required
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-[#9B9B9B]">
                    Minimum investment of $3,000 required
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  onClick={() => setSelectedOption("")}
                  fullWidth
                  variant="secondary"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  disabled={
                    isLoading ||
                    (selectedOption === "overdraft" && !selectedLimit) ||
                    (selectedOption === "investment" &&
                      (!investmentAmount ||
                        parseFloat(investmentAmount) < 3000))
                  }
                >
                  Finish
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
