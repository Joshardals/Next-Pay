import { FirebaseError } from "firebase/app";

type FirebaseErrorCode = string;

interface ErrorMessages {
  [key: FirebaseErrorCode]: string;
}

const AUTH_ERROR_MESSAGES: ErrorMessages = {
  // Sign up errors
  "auth/email-already-in-use":
    "This email is already registered. Please try signing in instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/operation-not-allowed":
    "Sign up is currently disabled. Please try again later.",
  "auth/weak-password":
    "Password should be at least 6 characters long with a mix of letters, numbers, and symbols.",

  // Sign in errors
  "auth/user-not-found":
    "No account found with this email. Please sign up first.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential":
    "Invalid credentials. Please check your email and password.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",

  // Common errors
  "auth/network-request-failed":
    "Connection error. Please check your internet connection and try again.",
  "auth/too-many-requests":
    "Too many unsuccessful attempts. Please try again later.",
  "auth/internal-error":
    "Something went wrong on our end. Please try again later.",
};

export const getAuthErrorMessage = (
  error: FirebaseError | Error | unknown
): string => {
  if (error instanceof FirebaseError) {
    return (
      AUTH_ERROR_MESSAGES[error.code] ||
      "An unexpected error occurred. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};
