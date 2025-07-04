"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Repository } from "@/types"
import { getCachedRepositories, setCachedRepositories } from "@/utils/cache"
import { AlertTriangle, LogOut, RefreshCw, Trash2 } from "lucide-react"
import { FaStar } from "react-icons/fa"
import { GoRepoForked } from "react-icons/go"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { notifyError, notifySuccess } from "@/components/toast"

export function Repos() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchRepositoriesFromAPI = useCallback(async () => {
    try {
      const response = await fetch("/api/github/repos")

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return null
        }
        throw new Error("Failed to fetch repositories")
      }

      const repos = await response.json()
      return repos
    } catch (error) {
      console.error("Error fetching repositories:", error)
      notifyError({
        title: "Error",
        description: "Failed to fetch repositories",
      })
      return null
    }
  }, [router])

  const fetchRepositories = useCallback(
    async (forceRefresh = false) => {
      setLoading(true)
      try {
        if (!forceRefresh) {
          const cachedRepos = getCachedRepositories()
          if (cachedRepos) {
            setRepositories(cachedRepos)
            setLoading(false)
            return
          }
        }

        const repos = await fetchRepositoriesFromAPI()
        if (repos) {
          setRepositories(repos)
          setCachedRepositories(repos)
        }
      } finally {
        setLoading(false)
      }
    },
    [fetchRepositoriesFromAPI]
  )

  const refreshRepositories = useCallback(async () => {
    await fetchRepositories(true)
  }, [fetchRepositories])

  const deleteRepository = async (fullName: string) => {
    setDeleting(fullName)
    try {
      const response = await fetch("/api/github/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullRepoName: fullName }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to delete repository")
      }

      const updatedRepos = repositories.filter(
        (repo) => repo.full_name !== fullName
      )
      setRepositories(updatedRepos)
      // Update local storage with the new repository list
      setCachedRepositories(updatedRepos)

      notifySuccess({
        title: "Success",
        description: `Repository ${fullName} deleted successfully`,
      })
    } catch (error) {
      console.error("Error deleting repository:", error)
      notifyError({
        title: "Error",
        description: "Failed to delete repository",
      })
    } finally {
      setDeleting(null)
    }
  }

  const batchDeleteRepositories = async () => {
    if (selectedRepos.length === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedRepos.length} repositories? This action cannot be undone.`
    )
    if (!confirmed) return

    try {
      const response = await fetch("/api/github/batch-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoNames: selectedRepos }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to delete repositories")
      }

      const result = await response.json()

      const updatedRepos = repositories.filter(
        (repo) => !result.results.successful.includes(repo.full_name)
      )
      setRepositories(updatedRepos)
      setCachedRepositories(updatedRepos)
      setSelectedRepos([])

      notifySuccess({
        title: "Batch Delete Complete",
        description: result.message,
      })
    } catch (error) {
      console.error("Error batch deleting repositories:", error)
      notifyError({
        title: "Error",
        description: "Failed to delete repositories",
      })
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/")
    }
  }

  const toggleRepoSelection = (fullName: string) => {
    setSelectedRepos((prev) =>
      prev.includes(fullName)
        ? prev.filter((name) => name !== fullName)
        : [...prev, fullName]
    )
  }

  const selectAllRepos = () => {
    if (selectedRepos.length === repositories.length) {
      setSelectedRepos([])
    } else {
      setSelectedRepos(repositories.map((repo) => repo.full_name))
    }
  }

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")

    if (tokenFromUrl) {
      window.history.replaceState({}, "", "/repos")
    }

    fetchRepositories()
  }, [searchParams, fetchRepositories])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col items-center justify-between gap-5 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">GitHub Repositories</h1>
          <p className="text-muted-foreground">
            Manage and clean up your repositories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshRepositories}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button onClick={logout} variant="outline">
            <LogOut />
            Logout
          </Button>
        </div>
      </div>

      {selectedRepos.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium">
                {selectedRepos.length} repositories selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={selectAllRepos} variant="outline" size="sm">
                {selectedRepos.length === repositories.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <Button
                onClick={batchDeleteRepositories}
                variant="destructive"
                size="sm"
              >
                <Trash2 />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Loading repositories...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {repositories.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No repositories found</p>
              </CardContent>
            </Card>
          ) : (
            repositories.map((repo) => (
              <Card key={repo.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`repo-${repo.id}`}
                        checked={selectedRepos.includes(repo.full_name)}
                        onCheckedChange={() =>
                          toggleRepoSelection(repo.full_name)
                        }
                        className="mt-2"
                      />
                      <div>
                        <CardTitle className="text-lg">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {repo.name}
                          </a>
                        </CardTitle>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {repo.description || "No description"}
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          {repo.language && (
                            <Badge variant="secondary">{repo.language}</Badge>
                          )}
                          {repo.private && (
                            <Badge variant="outline">Private</Badge>
                          )}
                          <span className="text-muted-foreground flex items-center gap-1 text-sm">
                            <FaStar className="text-yellow-500" />{" "}
                            {repo.stargazers_count}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1 text-sm">
                            <GoRepoForked /> {repo.forks_count}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteRepository(repo.full_name)}
                      disabled={deleting === repo.full_name}
                      variant="destructive"
                      size="sm"
                    >
                      {deleting === repo.full_name ? (
                        <RefreshCw className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
