"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';


export default function VerifyEmailPage() {
  const { token } = useParams();
  const { signUp, isLoaded } = useSignUp();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;
  
    setIsVerifying(true);
    try {
      const formattedCode = code.trim();
      
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code: formattedCode,
      });
  
      if (completeSignUp?.status === "complete") {
        // Create active session
        await completeSignUp.createdSessionId;
        
        // Wait for session to be active before redirect
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        toast.success("Email verified successfully!", {
          duration: 3000,
          position: "top-center",
        });
        
        // Redirect after ensuring session is active
        window.location.href = "/userDashboard";
      } else {
        toast.error("Invalid code. Please try again.", {
          duration: 3000,
          position: "top-center",
        });
        setCode("");
      }
    } catch (error: unknown) {
      console.log("Verification error:", error);
      const err = error as Error;
      toast.error("Invalid code. Please check and try again.", {
        duration: 3000,
        position: "top-center",
      });
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };
  
  
  
  
  
  
  
  
  
  const handleResendCode = async () => {
    try {
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("New verification code sent! Check your email.", {
        duration: 3000,
        position: "top-center",
      });
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Failed to send new code. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the verification code sent to {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Enter verification code"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={!isLoaded || isVerifying || !code}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Didn't receive a code?{" "}
          <button
            onClick={handleResendCode}
            className="font-medium text-primary hover:text-secondary"
          >
            Resend code
          </button>
        </p>
      </motion.div>
      <Toaster />
    </div>
  );
}
