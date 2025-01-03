"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FormInput, Button } from "../Form/FormInput";
import { toast } from "react-hot-toast";

interface VerificationInfo {
  fullName: string;
  ssn: string;
  idNumber: string;
  address: string;
  age: string;
}

export function UserVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
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

        // Check if email is verified
        if (!userData.emailVerified) {
          router.push("/verify-email");
          return;
        }

        // Check if all steps are completed
        if (
          userData.verificationInfo &&
          (userData.overdraftType ||
            userData.overdraftLimit ||
            userData.investmentAmount)
        ) {
          router.push("/dashboard");
          return;
        }

        // If verification info exists, check the flow status
        if (userData.verificationInfo) {
          // If verification is approved or rejected, handle accordingly
          if (userData.verificationStatus === "approved") {
            router.push("/dashboard");
            return;
          } else if (userData.verificationStatus === "rejected") {
            toast.error(
              "Your verification was rejected. Please contact support."
            );
            router.push("/dashboard");
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
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };

    checkVerificationStatus();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const verificationInfo: VerificationInfo = {
      fullName: formData.get("fullName") as string,
      ssn: formData.get("ssn") as string,
      idNumber: formData.get("idNumber") as string,
      address: formData.get("address") as string,
      age: formData.get("age") as string,
    };

    try {
      if (!user) throw new Error("No user found");

      // Double check status before submitting
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (!userData?.emailVerified) {
        throw new Error("Please verify your email first");
      }

      if (userData?.verificationInfo) {
        throw new Error("Verification already submitted");
      }

      await updateDoc(doc(db, "users", user.uid), {
        verificationInfo,
        verificationStatus: "pending",
        verificationSubmittedAt: new Date().toISOString(),
      });

      toast.success("Verification submitted successfully!");
      router.push("/verification/overdraft");
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

  return (
    <main className="w-full flex flex-col items-center min-h-screen px-4 text-[#E4E4E4] mb-14">
      <div className="w-full max-w-md space-y-8">
        <div className="w-full rounded">
          <h1 className="text-2xl font-bold mb-6 text-[#E4E4E4]">
            Verify Your Identity
          </h1>
          <p className="text-[#9B9B9B] mb-6">
            Please provide the following information to verify your US
            citizenship and identity.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <FormInput
                name="fullName"
                label="Full Legal Name"
                type="text"
                placeholder="Enter your full name"
                required
                isLoading={isLoading}
                disabled={isLoading}
              />

              <FormInput
                name="ssn"
                label="Social Security Number"
                type="text"
                placeholder="Enter your SSN"
                pattern="[0-9]{9}"
                title="Please enter a valid 9-digit SSN"
                required
                isLoading={isLoading}
                disabled={isLoading}
              />

              <FormInput
                name="idNumber"
                label="Government ID Number"
                type="text"
                placeholder="Enter your ID number"
                required
                isLoading={isLoading}
                disabled={isLoading}
              />

              <FormInput
                name="address"
                label="Current Residential Address"
                type="text"
                placeholder="Enter your full address"
                required
                isLoading={isLoading}
                disabled={isLoading}
              />

              <FormInput
                name="age"
                label="Age"
                type="number"
                min="18"
                max="120"
                placeholder="Enter your age"
                required
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Submit Verification
              </Button>
            </div>

            <p className="mt-4 text-xs text-[#9B9B9B] text-center">
              By submitting this form, you agree to our verification process and
              consent to the validation of your provided information.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
