"use client";
import { useState } from "react";
import { useStupes } from "@/stores/useStupes";
import { Loader2 } from "lucide-react";

type StepUserDetailsProps = {
  onSubmit?: () => Promise<void> | void;
  isLoading?: boolean;
};

export default function StepUserDetails({ onSubmit, isLoading = false }: StepUserDetailsProps) {
  const { name, email, password, setName, setEmail, setPassword } = useStupes();
  const [internalLoading, setInternalLoading] = useState(false);

  // Use external loading state if provided, otherwise use internal
  const loading = isLoading || internalLoading;

  const handleNext = async () => {
    // Don't proceed if already loading or missing required fields
    if (loading || !name || !email || !password) return;

    try {
      setInternalLoading(true);
      
      if (onSubmit) {
        await onSubmit();
      }
    } catch (error) {
      console.error("Error in StepUserDetails:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  const isFormValid = name.trim() && email.trim() && password.trim();

  return (
    <div className="max-w-lg w-full space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Your details</h1>
        <p className="text-sm text-gray-600">
          Please provide your information to create your account
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password should be at least 8 characters long
          </p>
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={loading || !isFormValid}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Next"
        )}
      </button>
    </div>
  );
}