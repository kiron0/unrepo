"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, Github, Loader2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Login() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubLogin = () => {
    setIsLoading(true)
    window.location.href = "/api/auth/login"
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-3 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to RemoveIt
          </CardTitle>
          <CardDescription>
            Manage and clean up your GitHub repositories with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Button size="sm" onClick={handleGitHubLogin} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github />
                  Login with GitHub
                </>
              )}
            </Button>
            <span className="text-muted-foreground text-sm">or </span>
            <Link
              href="/"
              className={buttonVariants({
                size: "sm",
                variant: "outline",
              })}
            >
              <ChevronLeftIcon /> Back to Home
            </Link>
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
