"use client"

import { useState } from "react"
import { Github, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubLogin = () => {
    setIsLoading(true)
    window.location.href = "/api/auth/login"
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to RemoveIt
          </CardTitle>
          <CardDescription>
            Manage and clean up your GitHub repositories with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="h-12 w-full text-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Github className="mr-2 h-5 w-5" />
                Login with GitHub
              </>
            )}
          </Button>

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
