"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface VerificationStatus {
  started: boolean;
  completed: boolean;
  startTime: number;
  estimatedDays: number;
}

export function VerificationPending() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!userData?.bankingInfoSubmittedAt) return;

    const updateProgress = () => {
      const submittedAt = new Date(userData.bankingInfoSubmittedAt).getTime();
      const now = new Date().getTime();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

      // Calculate elapsed time since submission
      const elapsed = now - submittedAt;

      // Calculate progress (max 90%)
      const calculatedProgress = Math.min(90, (elapsed / twoDaysInMs) * 100);
      setProgress(calculatedProgress);

      // Calculate remaining time
      const remainingMs = Math.max(0, twoDaysInMs - elapsed);
      const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
      const remainingMinutes = Math.floor(
        (remainingMs % (60 * 60 * 1000)) / (60 * 1000)
      );

      if (remainingHours > 24) {
        const days = Math.ceil(remainingHours / 24);
        setTimeRemaining(
          `${days} business day${days > 1 ? "s" : ""} remaining`
        );
      } else if (remainingHours > 0) {
        setTimeRemaining(`${remainingHours}h ${remainingMinutes}m remaining`);
      } else if (remainingMinutes > 0) {
        setTimeRemaining(`${remainingMinutes} minutes remaining`);
      } else {
        setTimeRemaining("Completing soon...");
      }
    };

    // Update immediately and then every minute
    updateProgress();
    const interval = setInterval(updateProgress, 60000);

    return () => clearInterval(interval);
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getVerificationStep = () => {
    if (!userData?.bankingInfoSubmittedAt)
      return {
        bankInfo: false,
        verifying: false,
        finalizing: false,
      };

    const submittedAt = new Date(userData.bankingInfoSubmittedAt).getTime();
    const now = new Date().getTime();
    const elapsed = now - submittedAt;
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const progressPercentage = (elapsed / twoDaysInMs) * 100;

    return {
      bankInfo: true,
      verifying: progressPercentage >= 30,
      finalizing: progressPercentage >= 70,
    };
  };

  const steps = getVerificationStep();

  return (
    <main className="min-h-screen bg-[#121212] text-[#E4E4E4] px-4 pb-14">
      <div className="max-w-2xl mx-auto pt-16">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Account Verification</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-transparent border border-[#333333] rounded-lg hover:bg-[#2D2D2D] transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#333333]">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm text-goldenrod">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-[#333333] rounded-full h-2">
              <div
                className="bg-goldenrod h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            Your Bank Account is Being Verified
          </h2>

          <div className="space-y-4">
            <p className="text-[#B3B3B3]">
              We're currently processing your bank account verification.{" "}
              {timeRemaining}
            </p>

            {/* Status Steps */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    steps.bankInfo ? "bg-goldenrod" : "bg-[#2D2D2D]"
                  }`}
                ></div>
                <span>Bank information received</span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    steps.verifying
                      ? "bg-goldenrod"
                      : "bg-[#2D2D2D] animate-pulse"
                  }`}
                ></div>
                <span>Verifying account details</span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    steps.finalizing ? "bg-goldenrod" : "bg-[#2D2D2D]"
                  }`}
                ></div>
                <span>Finalizing verification</span>
              </div>
            </div>

            {/* Rest of the component remains the same */}
            {/* Additional Information */}
            <div className="mt-8 p-4 bg-[#2D2D2D] rounded-lg">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-[#B3B3B3]">
                <li>You'll receive an email once verification is complete</li>
                <li>Your dashboard will be automatically updated</li>
                <li>You can then start using all account features</li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="text-center mt-8 pt-6 border-t border-[#333333]">
              <p className="text-sm text-[#B3B3B3]">
                Need assistance? Contact our support team at{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-goldenrod hover:underline"
                >
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Time Card */}
        <div className="mt-6 bg-[#1A1A1A] rounded-xl p-6 border border-[#333333]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#2D2D2D] flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <div>
              <h3 className="font-medium">Estimated Completion Time</h3>
              <p className="text-sm text-[#B3B3B3]">{timeRemaining}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
