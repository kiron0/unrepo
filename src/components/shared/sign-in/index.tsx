"use client"

import { useEffect, useState } from "react"
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

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam === "auth_failed") {
      setError("Authentication failed. Please try again.")
    } else if (errorParam === "access_denied") {
      setError("Access denied. Please allow access to continue.")
    } else if (errorParam === "bad_credentials") {
      setError("Invalid credentials. Please log in again.")
    } else if (errorParam === "access_token_missing") {
      setError("Access token is missing. Please log in again.")
    } else {
      setError(null)
    }
  }, [searchParams])

  const handleGitHubLogin = () => {
    setIsLoading(true)
    setError(null)
    window.location.href = "/api/auth/sign-in"
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
