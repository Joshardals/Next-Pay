import React, { JSX } from "react";

interface ErrorMessageProps {
  error: string;
}

export function ErrorMessage({ error }: ErrorMessageProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 p-4 mb-5 bg-red-900/10 border-l-4 border-red-500 rounded-r-md">
      <svg
        className="w-5 h-5 text-red-500 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p className="text-sm font-medium text-red-400">{error}</p>
    </div>
  );
}