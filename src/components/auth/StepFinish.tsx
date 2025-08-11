"use client";
import { useStupes } from "@/stores/useStupes";
import { useEffect } from "react";

export default function StepFinish() {
  const { reset, name } = useStupes();

  // Reset scroll position on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-md mx-auto text-center space-y-6 p-4">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-orange-500">{name}</span> 🎉
        </h1>
        <p className="text-gray-600 text-lg">
          Your account has been created successfully!
        </p>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          aria-label="Start over and create new account"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}