"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { siteConfig } from "@/config"
import { AlertCircle, ChevronLeftIcon, GithubIcon, Loader2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const errorMessages: Record<string, string> = {
  auth_failed: "Authentication failed. Please try again.",
  access_denied: "Access denied. Please allow access to continue.",
  bad_credentials: "Invalid credentials. Please log in again.",
  access_token_missing: "Access token is missing. Please log in again.",
  authentication_required: "Authentication required. Please log in.",
  server_error: "Server error. Please try again later.",
}

function SignInSuspense() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      const message = errorMessages[errorParam] || "An unknown error occurred."
      setError(message)
      setIsLoading(false)
    } else {
      setError(null)
    }
  }, [searchParams])

  const handleGitHubLogin = () => {
    setIsLoading(true)
    setError(null)
    const authUrl = `/api/auth/sign-in`
    window.location.href = authUrl
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="relative mx-3 w-full max-w-xl">
        <Link
          href="/"
          className={buttonVariants({
            size: "sm",
            variant: "outline",
            className: "absolute top-4 left-4",
          })}
        >
          <ChevronLeftIcon />
        </Link>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to{" "}
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text tracking-tight text-transparent">
              {siteConfig.name}
            </span>
          </CardTitle>
          <CardDescription>
            Manage and clean up your GitHub repositories with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-lg border p-3 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="group from-primary to-secondary text-primary-foreground bg-gradient-to-tr"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <GithubIcon className="transition-transform group-hover:scale-110" />
                  Sign In with GitHub
                </>
              )}
            </Button>
          </div>

          <div className="text-muted-foreground text-center text-sm">
            <p>By logging in, you agree to grant access to:</p>
            <ul className="mt-2 space-y-1">
              <li>• View your repositories</li>
              <li>• Delete repositories (with your permission)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-t-primary border-muted h-12 w-12 animate-spin rounded-full border-4" />
        </div>
      }
    >
      <SignInSuspense />
    </Suspense>
  )
}
