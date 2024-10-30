'use client'

import { useSignUp } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from 'react-hot-toast'

export default function VerifyEmailPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [email, setEmail] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else {
      toast.error("Email address is missing. Please start the sign-up process again.")
      router.push("/sign-up")
    }
  }, [searchParams, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded || !signUp || !email) return

    setIsVerifying(true)
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2))
        throw new Error("Unable to complete signup")
      }
      await setActive({ session: completeSignUp.createdSessionId })
      toast.success("Email verified successfully!")
      router.push("/userDashboard")
    } catch (error) {
      console.error("Verification error:", error)
      setAttempts(prev => prev + 1)
      if (attempts >= 2) {
        toast.error("Too many failed attempts. Please request a new code.", {
          duration: 5000,
        })
      } else {
        toast.error("Invalid verification code. Please check your email and try again.", {
          duration: 3000,
        })
      }
      setCode("")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      toast.success("New verification code sent! Check your email.", {
        duration: 3000,
      })
      setAttempts(0) // Reset attempts after resending
    } catch (error) {
      console.error("Resend code error:", error)
      toast.error("Failed to send new code. Please try again or contact support.", {
        duration: 5000,
      })
    }
  }

  if (!email) {
    return null // or a loading state
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!isLoaded || isVerifying || !code || !email || attempts >= 3}
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Didn't receive a code or need a new one?{" "}
            <button
              onClick={handleResendCode}
              className="font-medium text-primary hover:text-secondary"
            >
              Resend code
            </button>
          </p>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}