"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { GitHubUser, Repository } from "@/types"
import { clearCachedUserData, setCachedUserData } from "@/utils/cache"
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

  const getFiltersFromURL = useCallback((): FilterParams => {
    const searchParam = searchParams.get("search") || ""
    const affiliationParam = searchParams.get("affiliation") || "owner"
    const visibilityParam = searchParams.get("visibility") || "all"
    const sortParam = searchParams.get("sort") || "updated"
    const directionParam = searchParams.get("direction") || "desc"
    const perPageParam = parseInt(searchParams.get("per_page") || "30")
    const pageParam = parseInt(searchParams.get("page") || "1")

    const validAffiliation: FilterParams["affiliation"] = [
      "owner",
      "collaborator",
      "organization_member",
    ].includes(affiliationParam as any)
      ? (affiliationParam as FilterParams["affiliation"])
      : "owner"

    const validVisibility: FilterParams["visibility"] = [
      "all",
      "public",
      "private",
    ].includes(visibilityParam as any)
      ? (visibilityParam as FilterParams["visibility"])
      : "all"

    const validSort: FilterParams["sort"] = [
      "created",
      "updated",
      "pushed",
      "full_name",
    ].includes(sortParam as any)
      ? (sortParam as FilterParams["sort"])
      : "updated"

    const validDirection: FilterParams["direction"] = ["asc", "desc"].includes(
      directionParam as any
    )
      ? (directionParam as FilterParams["direction"])
      : "desc"

    // Validate per_page to only allowed values
    const allowedPerPageValues: FilterParams["per_page"][] = [
      10, 25, 30, 50, 100,
    ]
    const validPerPage: FilterParams["per_page"] =
      allowedPerPageValues.includes(perPageParam as any)
        ? (perPageParam as FilterParams["per_page"])
        : 30

    const validPage = Math.max(pageParam || 1, 1)

    return {
      search: searchParam,
      affiliation: validAffiliation,
      visibility: validVisibility,
      sort: validSort,
      direction: validDirection,
      per_page: validPerPage,
      page: validPage,
    }
  }, [searchParams])

  // Initialize with default filters, will be updated from URL in useEffect
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    affiliation: "owner",
    visibility: "all",
    sort: "updated",
    direction: "desc",
    per_page: 30,
    page: 1,
  })

  const [isInitialized, setIsInitialized] = useState(false)

  const updateCachedUserDataAfterDeletion = useCallback(async () => {
    try {
      const result = await axios.get<GitHubUser>("/api/github/user")
      setCachedUserData(result?.data)
    } catch (error) {
      console.error("Error fetching updated user data:", error)
    }
  }, [])

  const updateURLWithFilters = useCallback(
    (filterParams: FilterParams) => {
      const params = new URLSearchParams()

      // Only add non-default values to the URL
      if (filterParams.search) params.set("search", filterParams.search)
      if (filterParams.affiliation !== "owner")
        params.set("affiliation", filterParams.affiliation)
      if (filterParams.visibility !== "all")
        params.set("visibility", filterParams.visibility)
      if (filterParams.sort !== "updated") params.set("sort", filterParams.sort)
      if (filterParams.direction !== "desc")
        params.set("direction", filterParams.direction)
      if (filterParams.per_page !== 30)
        params.set("per_page", filterParams.per_page.toString())
      if (filterParams.page !== 1)
        params.set("page", filterParams.page.toString())

      const queryString = params.toString()
      const newUrl = queryString ? `/repos?${queryString}` : "/repos"

      router.replace(newUrl, { scroll: false })
    },
    [router]
  )

  const buildQueryString = useCallback((filterParams: FilterParams) => {
    const params = new URLSearchParams()

    params.append("sort", filterParams.sort)
    params.append("direction", filterParams.direction)
    params.append("per_page", filterParams.per_page.toString())
    params.append("page", filterParams.page.toString())

    if (filterParams.affiliation !== "owner") {
      params.append("affiliation", filterParams.affiliation)
    }
    if (filterParams.visibility !== "all") {
      params.append("visibility", filterParams.visibility)
    }

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
    async (currentFilters: FilterParams) => {
      setLoading(true)
      try {
        // Always fetch fresh data for each request
        const repos = await fetchRepositoriesFromAPI(currentFilters)

        if (repos && Array.isArray(repos)) {
          setRepositoriesSafe(repos)

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
    await fetchRepositories(filters)
  }, [fetchRepositories, filters])

  const handleFilterChange = useCallback(
    (key: keyof FilterParams, value: string | number) => {
      let processedValue: string | number = value

      // Validate and sanitize values
      if (key === "page" || key === "per_page") {
        processedValue = Number(value)
        if (key === "per_page") {
          // Validate per_page to only allowed values
          const allowedPerPageValues: FilterParams["per_page"][] = [
            10, 25, 30, 50, 100,
          ]
          processedValue = allowedPerPageValues.includes(processedValue as any)
            ? (processedValue as FilterParams["per_page"])
            : 30
        } else if (key === "page") {
          processedValue = Math.max(processedValue, 1)
        }
      }

      const newFilters = {
        ...filters,
        [key]: processedValue,
        page: key !== "page" ? 1 : Number(processedValue),
      }
      setFilters(newFilters)
      updateURLWithFilters(newFilters)
      fetchRepositories(newFilters)
    },
    [filters, fetchRepositories, updateURLWithFilters]
  )

  const handleFiltersChange = useCallback(
    (updates: Partial<FilterParams>) => {
      const newFilters = {
        ...filters,
        ...updates,
        // Reset page to 1 unless page is explicitly being updated
        page: updates.page !== undefined ? updates.page : 1,
      }
      setFilters(newFilters)
      updateURLWithFilters(newFilters)
      fetchRepositories(newFilters)
    },
    [filters, fetchRepositories, updateURLWithFilters]
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

        updateCachedUserDataAfterDeletion()

        notifySuccess({
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

  const clearAllFilters = useCallback(() => {
    const defaultFilters: FilterParams = {
      search: "",
      affiliation: "owner",
      visibility: "all",
      sort: "updated",
      direction: "desc",
      per_page: 30,
      page: 1,
    }
    setFilters(defaultFilters)
    updateURLWithFilters(defaultFilters)
    fetchRepositories(defaultFilters)
  }, [updateURLWithFilters, fetchRepositories])

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (tokenFromUrl) {
      window.history.replaceState({}, "", "/repos")
      return
    }

    if (isLoggingOut) return

    // Initialize filters from URL on first load
    if (!isInitialized) {
      const urlFilters = getFiltersFromURL()
      setFilters(urlFilters)
      setIsInitialized(true)
      fetchRepositories(urlFilters)
    } else {
      // Handle URL changes after initialization (browser back/forward)
      const urlFilters = getFiltersFromURL()
      // Only update if filters actually changed to avoid infinite loops
      const filtersChanged =
        JSON.stringify(filters) !== JSON.stringify(urlFilters)
      if (filtersChanged) {
        setFilters(urlFilters)
        fetchRepositories(urlFilters)
      }
    }
  }, [
    searchParams,
    isLoggingOut,
    getFiltersFromURL,
    fetchRepositories,
    isInitialized,
    filters,
  ])

  return {
    repositories,
    loading,
    selectedRepos,
    totalPages,
    isLoggingOut,
    filters,
    refreshRepositories,
    handleFilterChange,
    handleFiltersChange,
    handleSearch,
    deleteRepository,
    batchDeleteRepositories,
    handleLogout,
    toggleRepoSelection,
    selectAllRepos,
    fetchRepositories,
    clearAllFilters,
  }
}
