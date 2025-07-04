"use client"
"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { GoCheck, GoRepo } from "react-icons/go"

import { buttonVariants } from "@/components/ui/button"

interface GitHubUser {
  avatar_url: string
  login: string
  name?: string
  bio?: string
  public_repos: number
  followers: number
  following: number
}

function SuccessSuspense() {
  const [user, setUser] = React.useState<GitHubUser | null>(null)
  const [loading, setLoading] = React.useState(true)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  React.useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    localStorage.setItem("github_token", token)
    axios
      .get<GitHubUser>("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching user:", err)
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
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
          <div className="mb-6 animate-bounce text-6xl text-red-500">⚠️</div>
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
      <div className="w-full max-w-lg transform rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary text-primary-foreground mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full">
            <GoCheck className="text-3xl text-green-500" />
          </div>

          <div className="mb-8">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={user.login}
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

          <div className="mb-8 grid w-full grid-cols-3 gap-4">
            {[
              { value: user.public_repos, label: "Repositories" },
              { value: user.followers, label: "Followers" },
              { value: user.following, label: "Following" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="transform rounded-lg bg-gray-50 p-4 text-center transition-all duration-200 hover:bg-gray-100"
              >
                <div className="text-xl font-bold text-gray-800">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
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
