"use client";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "../Form/FormInput";

const OVERDRAFT_LIMITS = [
  { label: "$20,000 - $50,000", value: "20k-50k" },
  { label: "$50,000 - $100,000", value: "50k-100k" },
  { label: "$500,000 and above", value: "500k+" },
];

export function OverdraftSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLimit, setSelectedLimit] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!user) throw new Error("No user found");

      await updateDoc(doc(db, "users", user.uid), {
        overdraftLimit: selectedLimit,
        overdraftSelectionAt: new Date().toISOString(),
      });

      router.push("/verification/investment-info");
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
    <main className="w-full flex flex-col items-center min-h-screen px-4 text-[#E4E4E4]">
      <div className="w-full max-w-md space-y-8">
        <div className="w-full bg-[#1D1D1D] p-6 rounded">
          <h1 className="text-2xl font-bold mb-6">Select Overdraft Limit</h1>
          <p className="text-[#9B9B9B] mb-6">
            Please select your preferred overdraft limit range.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {OVERDRAFT_LIMITS.map((limit) => (
                <div
                  key={limit.value}
                  className={`p-4 border rounded cursor-pointer ${
                    selectedLimit === limit.value
                      ? "border-goldenrod bg-[#2D2D2D]"
                      : "border-[#333333]"
                  }`}
                  onClick={() => setSelectedLimit(limit.value)}
                >
                  <div className="flex items-center">
                    <input
                      title="select overdraft limit"
                      type="radio"
                      name="overdraftLimit"
                      value={limit.value}
                      checked={selectedLimit === limit.value}
                      onChange={(e) => setSelectedLimit(e.target.value)}
                      className="mr-3"
                      required
                    />
                    <label>{limit.label}</label>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
