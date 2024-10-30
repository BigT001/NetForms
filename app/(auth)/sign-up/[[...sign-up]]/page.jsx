"use client";

import { useSignUp } from "@clerk/nextjs";
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
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
});

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleSubmit = async (values) => {
    if (!isLoaded || isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      const result = await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName
      });
  
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        toast.success("Account created successfully!");
        router.push("/userDashboard");
      } else {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code"
        });
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        toast.success("Check your email for verification code");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      if (err.errors) {
        toast.error(err.errors[0].message);
      } else {
        toast.error("An error occurred during sign-up. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUpWithGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/userDashboard",
      });
    } catch (err) {
      console.error("Google sign-up error:", err);
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start your journey with us today
          </p>
        </div>

        <Button
          onClick={signUpWithGoogle}
          className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FcGoogle className="w-5 h-5" />
          Sign up with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  {...form.register("firstName")}
                  id="firstName"
                  className="mt-1"
                  placeholder="Enter your first name"
                />
                {form.formState.errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  {...form.register("lastName")}
                  id="lastName"
                  className="mt-1"
                  placeholder="Enter your last name"
                />
                {form.formState.errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                {...form.register("email")}
                id="email"
                type="email"
                className="mt-1"
                placeholder="name@example.com"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                {...form.register("password")}
                id="password"
                type="password"
                className="mt-1"
                placeholder="Create a strong password"
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isLoaded || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/sign-in")}
            className="font-medium text-primary hover:text-secondary"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}