"use client";
import { useState } from "react";
import { Button, FormInput } from "./FormInput";
import Link from "next/link";

// Signup Form Component
export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Add your signup logic here
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid max-md:grid-cols-1 grid-cols-2 gap-4">
        <FormInput
          label="First name"
          type="text"
          placeholder="Legal First Name"
          required
        />
        <FormInput
          label="Last name"
          type="text"
          placeholder="Legal Last Name"
          required
        />
      </div>

      <FormInput
        label="Email address"
        type="email"
        placeholder="Enter Email Address"
        required
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter Password"
        required
      />

      <div className="flex items-start font-light">
        <input type="checkbox" className="mt-1 mr-2" id="terms" required />
        <label htmlFor="terms" className="text-sm text-[#9B9B9B]">
          I agree to Next Pay&apos;s{" "}
          <Link href="#" className="underline text-[#E4E4E4]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline text-[#E4E4E4]">
            Privacy Policy
          </Link>{" "}
          on Dec 31, 2024.
        </label>
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Get Started
      </Button>

      <div className="text-center font-light">
        Already have a River account?{" "}
        <Link href="/login" className="text-goldenrod">
          Sign in here
        </Link>
      </div>
    </form>
  );
}
