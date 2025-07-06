"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type { GitHubUser, Repository } from "@/types"
import {
  clearCachedRepositories,
  clearCachedUserData,
  getCachedRepositories,
  setCachedRepositories,
  setCachedUserData,
} from "@/utils/cache"
import axios from "axios"
import {
  AlertTriangle,
  ChevronLeftIcon,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogHelper } from "@/components/alert-dialog-helper"
import { notifyError, notifySuccess } from "@/components/toast"

import { RepoCard } from "./repo-card"
import { RepoFilters, type FilterParams } from "./repo-filters"
import { RepoPagination } from "./repo-pagination"

export function Repos() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [isBatchOpen, setIsBatchOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    affiliation: "owner",
    type: "all",
    visibility: "all",
    sort: "updated",
    direction: "desc",
    per_page: 30,
    page: 1,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const updateCachedUserDataAfterDeletion = useCallback(async () => {
    try {
      const result = await axios.get<GitHubUser>("/api/github/user")
      setCachedUserData(result?.data)
    } catch (error) {
      console.error("Error fetching updated user data:", error)
    }
  }, [])

  const buildQueryString = useCallback((filterParams: FilterParams) => {
    const params = new URLSearchParams()

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
        params.append(key, value.toString())
      }
    })

    return params.toString()
  }, [])

  const fetchRepositoriesFromAPI = useCallback(
    async (filterParams: FilterParams) => {
      try {
        const queryString = buildQueryString(filterParams)
        const response = await fetch(`/api/github/repos?${queryString}`)

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
    },
    [buildQueryString]
  )

  const fetchRepositories = useCallback(
    async (forceRefresh = false, currentFilters: FilterParams) => {
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

        const repos = await fetchRepositoriesFromAPI(currentFilters)
        if (repos) {
          setRepositories(repos)
          setCachedRepositories(repos)

          if (repos.length === currentFilters.per_page) {
            setTotalPages(currentFilters.page + 1)
          } else {
            setTotalPages(currentFilters.page)
          }
        }
      } finally {
        setLoading(false)
      }
    },
    [fetchRepositoriesFromAPI]
  )

  const refreshRepositories = useCallback(async () => {
    await fetchRepositories(true, filters)
  }, [fetchRepositories, filters])

  const handleFilterChange = useCallback(
    (key: keyof FilterParams, value: string | number) => {
      const newFilters = {
        ...filters,
        [key]: key === "page" || key === "per_page" ? Number(value) : value,
        page: key !== "page" ? 1 : Number(value),
      }
      setFilters(newFilters)
      fetchRepositories(true, newFilters)
    },
    [filters, fetchRepositories]
  )

  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (searchTerm.trim() === "") {
        return notifyError({
          title: "Search Error",
          description: "Search term cannot be empty.",
        })
      }
      handleFilterChange("search", searchTerm)
    },
    [handleFilterChange]
  )

  const deleteRepository = async (fullName: string) => {
    try {
      const response = await fetch("/api/github/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullRepoName: fullName }),
      })

      if (response.ok) {
        const updatedRepos = repositories.filter(
          (repo) => repo.full_name !== fullName
        )
        setRepositories(updatedRepos)
        setCachedRepositories(updatedRepos)

        updateCachedUserDataAfterDeletion()

        notifySuccess({
          title: "Success",
          description: `Repository ${fullName} deleted successfully`,
        })
      }
    } catch (error) {
      console.error("Error deleting repository:", error)
      notifyError({
        title: "Error",
        description: "Failed to delete repository",
      })
    }
  }

  const batchDeleteRepositories = async () => {
    if (selectedRepos.length === 0) return

    try {
      const response = await fetch("/api/github/batch-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoNames: selectedRepos }),
      })

      if (response.ok) {
        setIsBatchOpen(false)
        const result = await response.json()

        const updatedRepos = repositories.filter(
          (repo) => !result.results.successful.includes(repo.full_name)
        )
        setRepositories(updatedRepos)
        setCachedRepositories(updatedRepos)
        setSelectedRepos([])
        setTotalPages(Math.ceil(updatedRepos.length / filters.per_page))

        updateCachedUserDataAfterDeletion()

        notifySuccess({
          title: "Batch Delete Complete",
          description: result.message,
        })
      }
    } catch (error) {
      console.error("Error batch deleting repositories:", error)
      notifyError({
        title: "Error",
        description: "Failed to delete repositories",
      })
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      setSelectedRepos([])
      setRepositories([])

      await fetch("/api/auth/logout", { method: "POST" }).then((res) => {
        if (res.ok) {
          notifySuccess({
            description: "You have been logged out successfully.",
          })
        }
      })

      await clearCachedUserData()
      await clearCachedRepositories()

      setIsOpen(false)
      router.push("/")
      router.refresh()
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
  }, [searchParams])

  useEffect(() => {
    if (isLoggingOut) return

    const initialFilters = {
      search: "",
      affiliation: "owner",
      type: "all",
      visibility: "all",
      sort: "updated",
      direction: "desc",
      per_page: 30,
      page: 1,
    } as FilterParams

    fetchRepositories(false, initialFilters)
  }, [fetchRepositories, isLoggingOut])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col items-center gap-5 md:flex-row md:justify-between">
        <div className="w-full">
          <Link
            href="/"
            className="from-primary to-secondary flex items-center bg-gradient-to-tr bg-clip-text text-xl font-bold text-transparent md:text-2xl"
          >
            <ChevronLeftIcon className="text-muted-foreground" />
            GitHub Repositories
          </Link>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage repositories with filters, search, and batch operations.
          </p>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            onClick={refreshRepositories}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </Button>
          <AlertDialogHelper
            trigger={
              <Button className="w-full" variant="destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            }
            title="Are you sure you want to logout?"
            description="You will be redirected to the home page."
            func={() => handleLogout()}
            open={isOpen}
            setOpen={setIsOpen}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between lg:justify-end">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(filters.search)
            }}
            className="relative flex w-full max-w-md gap-2"
          >
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Quick search repositories..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>
            {filters.search && repositories.length > 0 ? (
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, search: "" }))
                  fetchRepositories(true, { ...filters, search: "" })
                }}
                disabled={loading}
              >
                Clear
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            )}
          </form>
          <RepoFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            repositoryCount={repositories.length}
            loading={loading}
          />
        </div>
        <p className="text-muted-foreground text-sm">
          Showing {repositories.length} repositories
        </p>
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
              <AlertDialogHelper
                trigger={
                  <Button variant="destructive" size="sm">
                    <Trash2 />
                    Delete Selected
                  </Button>
                }
                title="Are you sure you want to delete selected repositories?"
                description={`This action cannot be undone. ${selectedRepos.length} repositories will be permanently deleted.`}
                func={() => batchDeleteRepositories()}
                open={isBatchOpen}
                setOpen={setIsBatchOpen}
              />
            </div>
          </div>
        </div>
      )}

      {loading || isLoggingOut ? (
        <div className="py-16 text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>{isLoggingOut ? "Logging out..." : "Loading repositories..."}</p>
        </div>
      ) : (
        <>
          {repositories.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-xl border text-center">
              <AlertTriangle className="text-destructive size-12" />
              <p className="text-muted-foreground">
                {filters.search
                  ? `No repositories found matching "${filters.search}"`
                  : "No repositories found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {repositories?.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  isSelected={selectedRepos.includes(repo.full_name)}
                  onToggleSelection={toggleRepoSelection}
                  onDelete={deleteRepository}
                />
              ))}
            </div>
          )}
          <RepoPagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => handleFilterChange("page", page)}
          />
        </>
      )}
    </div>
  )
}
