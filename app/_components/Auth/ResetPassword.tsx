// app/reset-password/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { Button, FormInput } from "../Form/FormInput";
import { ErrorMessage } from "../Form/ErrorMessage";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValidCode, setIsValidCode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError("Invalid reset link");
        return;
      }

      try {
        await verifyPasswordResetCode(auth, oobCode);
        setIsValidCode(true);
      } catch (error) {
        setError("Invalid or expired reset link");
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!oobCode) return;

    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password reset successfully");
      router.push("/login");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidCode) {
    return (
      <div className="max-w-md mx-auto p-6 bg-[#1D1D1D] rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Invalid Reset Link
        </h2>
        <p className="text-center text-gray-300">
          {error || "Please request a new password reset link."}
        </p>
        <Button
          onClick={() => router.push("/forgot-password")}
          fullWidth
          className="mt-6"
        >
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-[#1D1D1D] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage error={error} />}
        <div className="space-y-6 mb-6">
          <FormInput
            name="password"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            required
            isLoading={isLoading}
            disabled={isLoading}
          />
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            required
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
