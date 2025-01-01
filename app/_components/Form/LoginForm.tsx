"use client";
import { useState } from "react";
import { Button, FormInput } from "./FormInput";
import Link from "next/link";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Add your login logic here
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Login error:", error); // Changed error message to "Login error"
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      <div className="space-y-6 mb-3">
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
      </div>

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/forgot-password"
          className=" text-xs font-light text-goldenrod"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth isLoading={isLoading} className="mb-6">
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
