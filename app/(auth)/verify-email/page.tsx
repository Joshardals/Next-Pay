"use client";
import { useAuth } from "@/contexts/AuthContext";
import { VerifyEmail } from "@/app/_components/Auth/VerifiyEmail";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoadingSpinner } from "@/app/_components/ui/LoadingSpinner";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.emailVerified) {
          // If email is verified, redirect based on verification info
          if (!userData?.verificationInfo) {
            router.push("/verification");
          } else {
            router.push("/dashboard/verification-pending");
          }
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    checkVerificationStatus();
  }, [user, router]);

  // Show loading state while checking
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <VerifyEmail />;
}
