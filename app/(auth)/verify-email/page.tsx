"use client";
import { useAuth } from "@/contexts/AuthContext";
import { VerifyEmail } from "@/app/_components/Auth/VerifiyEmail";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LoadingSpinner } from "@/app/_components/ui/LoadingSpinner";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/login");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData) {
          router.push("/login");
          return;
        }

        if (userData.emailVerified) {
          // If verification info doesn't exist, send to verification
          if (!userData.verificationInfo) {
            router.push("/verification");
            return;
          }

          // If verification is approved or rejected, handle accordingly
          if (userData.verificationStatus === "approved") {
            if (
              !userData.overdraftType ||
              !userData.overdraftLimit ||
              !userData.investmentAmount
            ) {
              router.push("/verification/overdraft");
              return;
            }
            router.push("/dashboard");
            return;
          } else if (userData.verificationStatus === "rejected") {
            toast.error(
              "Your verification was rejected. Please contact support."
            );
            return;
          }

          // If they haven't completed overdraft selection, send them there
          if (
            !userData.overdraftType &&
            !userData.overdraftLimit &&
            !userData.investmentAmount
          ) {
            router.push("/verification/overdraft");
            return;
          }

          // If all steps completed, go to dashboard
          if (
            userData.overdraftType ||
            userData.overdraftLimit ||
            userData.investmentAmount
          ) {
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking initial status:", error);
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
