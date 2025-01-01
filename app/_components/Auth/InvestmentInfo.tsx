"use client";
import { useRouter } from "next/navigation";
import { Button } from "../Form/FormInput";

export function InvestmentInfo() {
  const router = useRouter();

  return (
    <main className="w-full flex flex-col items-center min-h-screen px-4 text-[#E4E4E4]">
      <div className="w-full max-w-md space-y-8">
        <div className="w-full bg-[#1D1D1D] p-6 rounded">
          <h1 className="text-2xl font-bold mb-6">Welcome to Overdraft</h1>

          <div className="space-y-4 text-[#9B9B9B]">
            <p>
              You'll be participating in stocks exchange investment
              opportunities.
            </p>

            <div className="bg-[#2D2D2D] p-4 rounded">
              <h2 className="text-[#E4E4E4] font-semibold mb-2">
                Required Deposit
              </h2>
              <p>$3,000 USD</p>
              <p className="text-sm mt-2">
                Note: Due to your overdraft approval, management will handle
                this deposit on your behalf.
              </p>
            </div>

            <p>
              To complete your account setup and verification, you'll need to
              link a credit union or bank account for receiving funds.
            </p>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => router.push("/verification/bank-linking")}
              fullWidth
            >
              Continue to Bank Linking
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
