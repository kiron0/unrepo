"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { GitHubUser } from "@/types"
import { getCachedUserData, setCachedUserData } from "@/utils/cache"
import { getGitHubToken, setGitHubToken } from "@/utils/cookies"
import axios from "axios"
import { ChevronLeftIcon } from "lucide-react"
import { GoRepo } from "react-icons/go"
import { TiWarning } from "react-icons/ti"

import { buttonVariants } from "@/components/ui/button"

function SuccessSuspense() {
  const [user, setUser] = React.useState<GitHubUser | null>(null)
  const [loading, setLoading] = React.useState(true)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  React.useEffect(() => {
    const fetchUserData = async () => {
      const cachedUser = getCachedUserData()
      if (cachedUser) {
        setUser(cachedUser)
        setLoading(false)
        return
      }

      let authToken = token
      if (!authToken) {
        authToken = await getGitHubToken()
      }

      if (!authToken) {
        setLoading(false)
        return
      }

      if (token) {
        await setGitHubToken(token)
      }

      try {
        const { data } = await axios.get<GitHubUser>(
          "https://api.github.com/user",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
        setUser(data)
        setCachedUserData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching user:", err)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [token])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="border-t-primary h-12 w-12 animate-spin rounded-full border-4 border-gray-200" />
          <p className="animate-pulse text-lg font-medium text-gray-700">
            Connecting to GitHub...
          </p>
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
          <h1 className="mb-3 text-3xl font-extrabold text-gray-900">
            Authentication Failed
          </h1>
          <p className="mb-6 leading-relaxed text-gray-600">
            Unable to connect to your GitHub account. Please try again.
          </p>
          <Link
            href="/"
            className={buttonVariants({
              className:
                "from-primary to-secondary bg-gradient-to-tr hover:opacity-90",
            })}
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg transform rounded-3xl border p-6 shadow-lg transition-all md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={1080}
              height={1080}
              className="mx-auto mb-4 h-24 w-24 transform rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110"
            />
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Welcome, {user.name || user.login}!
            </h1>
            <p className="text-gray-500">@{user.login}</p>
            {user.bio && (
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-gray-600">
                {user.bio}
              </p>
            )}
          </div>
          <div className="mb-8 grid w-full grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { value: user.public_repos, label: "Repositories" },
              { value: user.followers, label: "Followers" },
              { value: user.following, label: "Following" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-muted transform rounded-lg p-4 transition-all duration-200 hover:bg-gray-100"
              >
                <p className="text-xl font-bold">{value}</p>
                <p className="text-muted-foreground text-center text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div>
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
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                className: "mt-4",
              })}
            >
              <ChevronLeftIcon /> Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Success() {
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
      <SuccessSuspense />
    </React.Suspense>
  )
}
