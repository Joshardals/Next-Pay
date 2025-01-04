"use client";
import { useState } from "react";
import { Button, FormInput } from "./FormInput";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { sendVerificationCode } from "@/lib/actions/verification";
import { getAuthErrorMessage } from "@/lib/utils/auth-errors";
import { ErrorMessage } from "./ErrorMessage";

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

      // Check email verification status from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();

      // If email not verified, send to verification
      if (!userData?.emailVerified) {
        await sendVerificationCode(userCredential.user.uid, email);
        router.push("/verify-email");
        return;
      }

      // If verification info not submitted, send to verification form
      if (!userData?.verificationInfo) {
        router.push("/verification");
        return;
      }

      // Check if user has completed overdraft/investment selection
      if (!userData.overdraftType && !userData.investmentAmount) {
        router.push("/verification/overdraft");
        return;
      }

      // All steps completed, proceed to dashboard
      router.push("/dashboard");
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      {error && <ErrorMessage error={error} />}

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
        <Link href="#" className="text-xs font-light text-goldenrod">
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
