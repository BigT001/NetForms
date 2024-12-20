'use client';

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values) => {
    if (!isLoaded) return;
    
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });
  
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        toast.success("Welcome back!")
        router.push("/userDashboard")
      } else {
        console.error("Unexpected result:", result)
        toast.error("An error occurred. Please try again.")
      }
    } catch (err) {
      console.error("Sign-in error:", err)
      
      const errorCode = err.errors?.[0]?.code;
      switch (errorCode) {
        case "form_password_incorrect":
          toast.error("Password is incorrect. Please try again.");
          break;
        case "form_identifier_not_found":
          toast.error("Email not found. Please check your email address.");
          break;
        default:
          toast.error(err.errors?.[0]?.message || "Sign-in failed. Please verify your email and password.");
      }
    }
  }

  const signInWithGoogle = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/userDashboard",
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Could not connect to Google. Please try again.");
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
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <Button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-secondary transition-colors"
        >
          <FcGoogle className="w-5 h-5" />
          Sign in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <Input
                {...form.register("email")}
                id="email"
                type="email"
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="name@example.com"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                {...form.register("password")}
                id="password"
                type="password"
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={async () => {
                  const email = form.getValues("email");
                  if (!email) {
                    toast.error("Please enter your email first");
                    return;
                  }

                  try {
                    const response = await signIn.create({
                      identifier: email,
                      strategy: "reset_password_email_code",
                    });

                    if (response) {
                      toast.success("Reset code sent! Check your email.", {
                        duration: 5000,
                      });
                      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
                    }
                  } catch (err) {
                    console.error("Reset password error:", err);
                    toast.error("Account not found. Please check your email address.");
                  }
                }}
                className="font-medium text-primary hover:text-secondary"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isLoaded}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            {!isLoaded ? "Loading..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/sign-up")}
            className="font-medium text-primary hover:text-secondary"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}