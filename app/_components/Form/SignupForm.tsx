"use client";
import { useState } from "react";
import { Button, FormInput } from "./FormInput";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { sendVerificationCode } from "@/lib/actions/verification";
import { getAuthErrorMessage } from "@/lib/utils/auth-errors";
import { ErrorMessage } from "./ErrorMessage";

export function SignupForm() {
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
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      });

      await sendVerificationCode(user.uid, email);
      router.push("/verify-email");
    } catch (error) {
      setError(getAuthErrorMessage(error));

      // Log the error for debugging (remove in production)
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <ErrorMessage error={error} />}

      {/* Rest of the form remains the same */}
      <div className="grid max-md:grid-cols-1 grid-cols-2 gap-4">
        <FormInput
          name="firstName"
          label="First name"
          type="text"
          placeholder="Legal First Name"
          required
          isLoading={isLoading}
          disabled={isLoading}
        />
        <FormInput
          name="lastName"
          label="Last name"
          type="text"
          placeholder="Legal Last Name"
          required
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>

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

      <div className="flex items-start font-light">
        <input
          type="checkbox"
          className="mt-1 mr-2"
          id="terms"
          required
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-sm text-[#9B9B9B]">
          I agree to Nex Pay&apos;s{" "}
          <Link
            href="#"
            className="underline text-[#E4E4E4] hover:text-goldenrod transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="underline text-[#E4E4E4] hover:text-goldenrod transition-colors"
          >
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Get Started
      </Button>

      <div className="text-center font-light">
        Already have a Nex Pay account?{" "}
        <Link
          href="/login"
          className={`text-goldenrod hover:text-goldenrod/80 transition-colors ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Sign in here
        </Link>
      </div>
    </form>
  );
}
