"use client";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Button } from "@/app/_components/Form/FormInput";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.emailVerified) {
        // Check if user has already completed verification
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData?.verificationInfo) {
          // If user hasn't completed verification, redirect to verification page
          router.push("/verification");
        } else {
          // If user has already completed verification, redirect to dashboard
          router.push("/dashboard/verification-pending");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      await sendEmailVerification(user);
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
    <main className="max-w-md mx-auto min-h-screen">
      <div className="p-6 bg-[#1D1D1D] rounded">
        <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
        <p className="mb-6">
          We&apos;ve sent you an email verification link. Please check your
          email and click the link to verify your account.
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <Button
          onClick={handleResendVerification}
          isLoading={isLoading}
          fullWidth
        >
          Resend verification email
        </Button>
      </div>
    </main>
  );
}
