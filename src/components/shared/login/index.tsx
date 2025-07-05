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
            Welcome to RemoveIt
          </CardTitle>
          <CardDescription>
            Manage and clean up your GitHub repositories with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Button onClick={handleGitHubLogin} disabled={isLoading}>
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
