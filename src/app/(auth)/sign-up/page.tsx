/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useStupes } from "@/stores/useStupes";
import StepUserType from "@/components/auth/StepUserType";
import StepUserDetails from "@/components/auth/StepUserDetails";
import StepOTPVerify from "@/components/auth/StepOTPVerify";
import StepFinish from "@/components/auth/StepFinish";
import StepProgressBar from "@/components/auth/StepProgressBar";
import { useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

export default function SignupPage() {
  const { step, nextStep, userType, name, email, password, reset } = useStupes();
  
  const [isRTL, setIsRTL] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, isLoaded, setActive } = useSignUp();

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsRTL(document.documentElement.dir === "rtl");
    }
  }, []);

  // Reset error when step changes
  useEffect(() => {
    setError(null);
  }, [step]);

  const handleUserDetailsSubmit = async () => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!email || !password || !name) {
        throw new Error("Please fill in all required fields");
      }

      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { 
          type: userType,
          name: name
        },
      });

      await signUp.prepareEmailAddressVerification({ 
        strategy: "email_code" 
      });
      
      nextStep();
    } catch (err: any) {
      console.error("Clerk signUp error:", err);
      
      if (err?.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!otp || otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit verification code");
      }

      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        nextStep();
      } else {
        throw new Error("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("OTP verify error:", err);
      
      if (err?.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-sm text-gray-600">Loading signup options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Header */}
      <header className="md:hidden p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <h1 className="text-xl font-bold ml-3">Company Logo</h1>
        </div>
      </header>

      <div className={`flex flex-1 flex-col md:flex-row ${isRTL ? "md:flex-row-reverse" : ""}`}>
        {/* Left side - Image (Desktop Only) */}
        <div className="hidden md:block md:w-1/2 relative bg-black">
          <Image
            src="/images/app-ui.png"
            alt="Dashboard preview"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] md:min-h-screen">
          <div className="flex-1 flex flex-col justify-center p-6 md:p-12 max-w-md w-full mx-auto">
            {/* Progress Bar */}
            {step !== 4 && (
              <div className="mb-8">
                <StepProgressBar />
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 1 && "Select Account Type"}
                {step === 2 && "Create Your Account"}
                {step === 3 && "Verify Your Email"}
                {step === 4 && "Account Created!"}
              </h1>
              <p className="text-gray-600">
                {step === 1 && "Choose the type of account that fits your needs"}
                {step === 2 && "Enter your details to get started"}
                {step === 3 && `We sent a code to ${email}`}
                {step === 4 && "Your account is ready to use"}
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {/* Step Components Container */}
            <div className="relative">
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">
                      {step === 2 ? "Creating account..." : "Verifying code..."}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Step Components */}
              {step === 1 && <StepUserType />}
              {step === 2 && (
                <StepUserDetails 
                  onSubmit={handleUserDetailsSubmit}
                  isLoading={isLoading}
                />
              )}
              {step === 3 && (
                <StepOTPVerify 
                  onVerify={handleOTPVerify}
                  isLoading={isLoading}
                  email={email}
                />
              )}
              {step === 4 && <StepFinish />}
            </div>
          </div>

          {/* Footer */}
          <div className="py-4 px-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}