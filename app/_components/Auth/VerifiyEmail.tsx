"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/app/_components/Form/FormInput";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { sendVerificationCode } from "@/lib/actions/verification";
import { toast } from "react-hot-toast";

export function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/login");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.emailVerified) {
          if (!userData?.verificationInfo) {
            router.push("/verification");
          } else {
            router.push("/dashboard/verification-pending");
          }
        }
      } catch (error) {
        console.error("Error checking initial status:", error);
      }
    };

    checkInitialStatus();
  }, [router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter a complete 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const storedCode = userData?.verificationCode;

      if (!storedCode) {
        throw new Error(
          "Verification code not found. Please request a new code."
        );
      }

      if (new Date(storedCode.expiresAt) < new Date()) {
        throw new Error("Code has expired. Please request a new code.");
      }

      if (storedCode.code !== verificationCode) {
        throw new Error("Invalid code. Please try again.");
      }

      await updateDoc(doc(db, "users", user.uid), {
        emailVerified: true,
        verificationCode: null,
      });

      toast.success("Email verified successfully!");

      if (!userData?.verificationInfo) {
        router.push("/verification");
      } else {
        router.push("/dashboard/verification-pending");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      await sendVerificationCode(user.uid, user.email!);
      toast.success("New verification code sent!");
      setResendTimer(60); // 60 seconds cooldown
      setCode(["", "", "", "", "", ""]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("Failed to send verification code");
        toast.error("Failed to send verification code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto min-h-screen p-4">
      <div className="p-6 bg-[#1D1D1D] rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Verify your email
        </h1>
        <p className="mb-6 text-center text-gray-300">
          We've sent a verification code to{" "}
          <span className="font-medium">{auth.currentUser?.email}</span>
        </p>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-500 bg-red-100/10 rounded-md border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                title="verification code"
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-bold bg-[#2D2D2D] border-2 border-[#3D3D3D] rounded-md focus:border-goldenrod focus:outline-none transition-colors"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
              />
            ))}
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading || code.join("").length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendCode}
            className={`text-sm ${
              resendTimer > 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-goldenrod hover:text-goldenrod/80"
            }`}
            disabled={isLoading || resendTimer > 0}
          >
            {resendTimer > 0
              ? `Resend code in ${resendTimer}s`
              : "Resend verification code"}
          </button>
        </div>
      </div>
    </main>
  );
}
