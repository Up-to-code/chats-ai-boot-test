"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2, Mail } from "lucide-react";

type StepOTPVerifyProps = {
  onVerify: (otp: string) => Promise<void>;
  isLoading?: boolean;
  email: string;
};

export default function StepOTPVerify({ onVerify, isLoading = false, email }: StepOTPVerifyProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [internalLoading, setInternalLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const loading = isLoading || internalLoading;

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6 || loading) return;

    try {
      setInternalLoading(true);
      await onVerify(otpString);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Reset OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setInternalLoading(false);
    }
  };

  const isComplete = otp.every(digit => digit !== "");
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return (
    <div className=" w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
        <p className="text-sm text-gray-600">
          We sent a verification code to{" "}
          <span className="font-medium text-gray-900">{maskedEmail}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter 6-digit verification code
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={!isComplete || loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            disabled={loading}
            className="text-sm text-orange-600 hover:text-orange-500 font-medium disabled:opacity-50 transition-colors"
          >
            Didn&#39;t receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  );
}