"use client";
import { useState } from "react";
import { Button, FormInput } from "../Form/FormInput";
import Link from "next/link";
import { ErrorMessage } from "../Form/ErrorMessage";
import { toast } from "react-hot-toast";
import { sendPasswordResetLink } from "@/lib/actions/passwordReset";

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await sendPasswordResetLink(email);
      setEmailSent(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      setError("Failed to send reset instructions. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#1D1D1D] rounded-lg shadow-xl">
      {!emailSent ? (
        <>
          <h2 className="text-2xl font-bold mb-2 text-center">
            Reset Password
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Enter your email address and we&apos;ll send you password reset
            instructions.
          </p>
          <form onSubmit={handleSubmit}>
            {error && <ErrorMessage error={error} />}
            <div className="space-y-6 mb-6">
              <FormInput
                name="email"
                label="Email address"
                type="email"
                placeholder="Enter your email address"
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
              className="mb-6"
            >
              Send Instructions
            </Button>
            <div className="text-center font-light">
              Remember your password?{" "}
              <Link href="/login" className="text-goldenrod">
                Sign in here
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-300 mb-6">
            We&apos;ve sent password reset instructions to your email. Please check
            your inbox and follow the instructions.
          </p>
          <Button
            onClick={() => setEmailSent(false)}
            fullWidth
            className="mb-6"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
