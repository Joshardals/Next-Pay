"use client";
import { useState } from "react";
import { Button, FormInput } from "./FormInput";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before logging in");
        return;
      }

      // Check if user has completed identity verification
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();

      if (!userData?.verificationInfo) {
        // User hasn't submitted verification
        router.push("/verification");
        return;
      }

      if (userData?.verificationStatus === "pending") {
        // User has submitted verification but it's still pending
        router.push("/dashboard/verification-pending");
        return;
      }

      if (userData?.verificationStatus === "rejected") {
        setError(
          "Your identity verification was rejected. Please contact support."
        );
        return;
      }

      // If verification is approved or no verification needed
      router.push("/dashboard");
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
    <form className="" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6 mb-3">
        <FormInput
          name="email"
          label="Email address"
          type="email"
          placeholder="Enter Email Address"
          required
          isLoading={isLoading}
          disabled={isLoading}
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          placeholder="Enter Password"
          required
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/forgot-password"
          className="text-xs font-light text-goldenrod"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
        className="mb-6"
      >
        Sign In
      </Button>

      <div className="text-center font-light">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-goldenrod">
          Sign up here
        </Link>
      </div>
    </form>
  );
}
