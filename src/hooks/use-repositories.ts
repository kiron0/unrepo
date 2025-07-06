"use client"

import { useCallback, useEffect, useState } from "react"
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

import type { FilterParams } from "@/components/shared/repos/repo-filters"
import { notifyError, notifySuccess } from "@/components/toast"

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const setRepositoriesSafe = useCallback((repos: any) => {
    if (Array.isArray(repos)) {
      setRepositories(repos)
    } else {
      setRepositories([])
    }
  }, [])

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
        const response = await axios.get(`/api/github/repos?${queryString}`)

        if (Array.isArray(response.data)) {
          return response.data
        } else {
          return []
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/sign-in?error=authentication_required")
          return []
        }

        notifyError({
          title: "Error",
          description:
            error.response?.data?.error || "Failed to fetch repositories",
        })
        return []
      }
    },
    [buildQueryString, router]
  )

  const fetchRepositories = useCallback(
    async (forceRefresh = false, currentFilters: FilterParams) => {
      setLoading(true)
      try {
        if (!forceRefresh) {
          const cachedRepos = getCachedRepositories()

          if (cachedRepos && Array.isArray(cachedRepos)) {
            setRepositoriesSafe(cachedRepos)
            setLoading(false)
            return
          } else if (cachedRepos) {
            await clearCachedRepositories()
          }
        }

        const repos = await fetchRepositoriesFromAPI(currentFilters)

        if (repos && Array.isArray(repos)) {
          setRepositoriesSafe(repos)
          setCachedRepositories(repos)

          if (repos.length === currentFilters.per_page) {
            setTotalPages(currentFilters.page + 1)
          } else {
            setTotalPages(currentFilters.page)
          }
        } else {
          setRepositoriesSafe([])
        }
      } finally {
        setLoading(false)
      }
    },
    [fetchRepositoriesFromAPI, setRepositoriesSafe]
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
      const response = await axios.delete("/api/github/delete", {
        data: { fullRepoName: fullName },
      })

      if (response.status === 200) {
        const updatedRepos = repositories.filter(
          (repo) => repo.full_name !== fullName
        )
        setRepositoriesSafe(updatedRepos)
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
      const response = await axios.delete("/api/github/batch-delete", {
        data: { repoNames: selectedRepos },
      })

      if (response.status === 200) {
        const result = response.data

        const updatedRepos = repositories.filter(
          (repo) => !result.results.successful.includes(repo.full_name)
        )
        setRepositoriesSafe(updatedRepos)
        setCachedRepositories(updatedRepos)
        setSelectedRepos([])
        setTotalPages(Math.ceil(updatedRepos.length / filters.per_page))

        updateCachedUserDataAfterDeletion()

        notifySuccess({
          title: "Batch Delete Complete",
          description: result.message,
        })

        return true // Success
      }
    } catch (error) {
      console.error("Error batch deleting repositories:", error)
      notifyError({
        title: "Error",
        description: "Failed to delete repositories",
      })
      return false // Failure
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      setSelectedRepos([])
      setRepositoriesSafe([])

      await axios.post("/api/auth/sign-out").then((res) => {
        if (res.status === 200) {
          notifySuccess({
            description: "You have been logged out successfully.",
          })
        }
      })

      await clearCachedUserData()
      await clearCachedRepositories()

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

  return {
    repositories,
    loading,
    selectedRepos,
    totalPages,
    isLoggingOut,
    filters,
    refreshRepositories,
    handleFilterChange,
    handleSearch,
    deleteRepository,
    batchDeleteRepositories,
    handleLogout,
    toggleRepoSelection,
    selectAllRepos,
    fetchRepositories,
  }
}
