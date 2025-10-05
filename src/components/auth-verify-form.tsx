"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { supabase } from "@/lib/supabase"
import { extractNameFromEmail, generateAvatarUrl } from "@/lib/auth-utils"
import { toast } from "sonner"
import { IconMoodHeart, IconArrowLeft } from "@tabler/icons-react"

export function AuthVerifyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem("email-for-verification")
    if (!storedEmail) {
      router.push("/auth/login")
      return
    }
    setEmail(storedEmail)
  }, [router])

  const handleVerify = async (code: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      })

      if (error) throw error

      console.log("OTP Verification successful:", data.user?.id)

      if (data.user) {
        // Check if user profile exists
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        // Create profile if it doesn't exist
        if (!profile) {
          const displayName = extractNameFromEmail(email)
          const avatarUrl = generateAvatarUrl(email)

          const { error: profileError } = await supabase
            .from("user_profiles")
            .insert({
              id: data.user.id,
              email: email,
              display_name: displayName,
              avatar_url: avatarUrl,
            })

          if (profileError) {
            console.error("Error creating profile:", profileError)
          }
        }

        // Clear session storage
        sessionStorage.removeItem("email-for-verification")

        toast.success("Welcome!", {
          description: "You've been successfully authenticated.",
        })

        // Use window.location for hard redirect to ensure session is recognized
        // Small delay to ensure session is fully set
        setTimeout(() => {
          window.location.href = "/"
        }, 500)
      }
    } catch (error: any) {
      toast.error("Verification failed", {
        description: error.message || "Please check your code and try again.",
      })
      setOtp("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (value: string) => {
    setOtp(value)
    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      handleVerify(value)
    }
  }

  const handleResend = async () => {
    setIsResending(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) throw error

      toast.success("Code resent!", {
        description: "Check your email for a new verification code.",
      })
    } catch (error: any) {
      toast.error("Failed to resend code", {
        description: error.message || "Please try again.",
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleBack = () => {
    sessionStorage.removeItem("email-for-verification")
    router.push("/auth/login")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <IconMoodHeart className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Enter Verification Code</h1>
                <p className="text-muted-foreground text-balance">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </Field>
              <Field>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending || isLoading}
                  className="w-full"
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </Button>
              </Field>
              <Field>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="w-full"
                >
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Field>
              <FieldDescription className="text-center text-xs">
                {isLoading
                  ? "Verifying your code..."
                  : "Enter the 6-digit code from your email"}
              </FieldDescription>
            </FieldGroup>
          </div>
          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Secure Access</h2>
                <p className="text-muted-foreground text-sm">
                  Your verification code is valid for 10 minutes. Once
                  verified, you&apos;ll stay logged in for 6 months.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
