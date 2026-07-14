"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
};

export default function PasswordInput({
  id,
  name,
  placeholder = "********",
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative mt-1">
      <input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="form-control pr-12"
      />

      <button
        type="button"
        onClick={() => setIsVisible((currentValue) => !currentValue)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        aria-label={
          isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6" />
      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a15.5 15.5 0 0 1-3.2 4.3" />
      <path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 8 10 8a10.7 10.7 0 0 0 4.1-.8" />
    </svg>
  );
}