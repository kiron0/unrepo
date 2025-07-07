"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type { GitHubUser } from "@/types"
import { getCachedUserData, setCachedUserData } from "@/utils"
import axios from "axios"
import { ChevronLeftIcon } from "lucide-react"
import { GoRepo } from "react-icons/go"
import { TiWarning } from "react-icons/ti"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function ProfileSuspense() {
  const [user, setUser] = React.useState<GitHubUser | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = React.useState(
    "Connecting to GitHub..."
  )

  React.useEffect(() => {
    const fetchUserData = async () => {
      const cachedUser = getCachedUserData()
      if (cachedUser) {
        setUser(cachedUser)
        setLoading(false)
        return
      }

      setLoadingMessage("Fetching user details...")
      try {
        const result = await axios.get<GitHubUser>("/api/github/user")
        setUser(result?.data)
        setCachedUserData(result?.data)
        setError(null)
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching user:", err)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="border-t-primary border-muted h-12 w-12 animate-spin rounded-full border-4" />
          <p className="animate-pulse text-lg font-medium">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-2xl p-8 shadow-xl">
          <div className="text-destructive mb-6 animate-bounce text-6xl">
            <TiWarning />
          </div>
          <h1 className="mb-3 text-3xl font-extrabold">
            {error ? "Authentication Error" : "Authentication Failed"}
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {error ||
              "Unable to connect to your GitHub account. Please try again."}
          </p>
          <Link
            href="/"
            className={buttonVariants({
              className:
                "from-primary to-secondary bg-gradient-to-tr hover:opacity-90",
            })}
          >
            <ChevronLeftIcon /> Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-lg transform rounded-3xl border p-4 shadow-lg transition-all md:p-6">
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            className: "absolute top-4 left-4",
          })}
        >
          <ChevronLeftIcon />
        </Link>
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={1080}
              height={1080}
              className="mx-auto mb-4 h-24 w-24 transform rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110"
            />
            <h1 className="mb-1 text-2xl font-bold">
              Welcome, {user.name || user.login}!
            </h1>
            <p className="text-muted-foreground">@{user.login}</p>
            {user.bio && (
              <p className="text-muted-foreground mx-auto mt-3 max-w-xs text-sm leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>
          <div className="mb-6 grid w-full grid-cols-3 gap-2 md:gap-4">
            {[
              {
                value: user.total_owned_repos || user.public_repos,
                label: "Total Repos",
              },
              { value: user.followers, label: "Followers" },
              { value: user.following, label: "Following" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-muted border-muted transform rounded-lg border p-4 transition-all duration-300 hover:bg-transparent"
              >
                <p className="text-xl font-bold">{value}</p>
                <p className="text-muted-foreground text-center text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {user.private_repos_count !== undefined && (
            <div className="mb-6 grid w-full grid-cols-2 gap-2 md:gap-4">
              {[
                {
                  value: user.public_repos_count || user.public_repos,
                  label: "Public",
                  color: "text-green-600",
                },
                {
                  value: user.private_repos_count,
                  label: "Private",
                  color: "text-orange-600",
                },
              ].map(({ value, label, color }) => (
                <div
                  key={label}
                  className="bg-muted border-muted transform rounded-lg border p-3 transition-all duration-300 hover:bg-transparent"
                >
                  <p className={cn("text-lg font-bold", color)}>{value}</p>
                  <p className="text-muted-foreground text-center text-xs">
                    {label} Repos
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="flex w-full flex-col items-center gap-4">
            <Link
              href="/repos"
              className={buttonVariants({
                className:
                  "from-primary to-secondary bg-gradient-to-tr hover:opacity-90",
              })}
            >
              <GoRepo />
              View Your Repositories
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Profile() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground text-lg font-medium">
            Loading...
          </div>
        </div>
      }
    >
      <ProfileSuspense />
    </React.Suspense>
  )
}
