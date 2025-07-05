"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * Custom hook to remove sensitive query parameters from URL after processing
 */
export function useCleanupQueryParams(
  paramsToRemove: string[],
  condition: boolean = true
) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!condition) return

    const hasParamsToRemove = paramsToRemove.some((param) =>
      searchParams.has(param)
    )

    if (hasParamsToRemove) {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      // Remove the specified parameters
      paramsToRemove.forEach((param) => {
        newSearchParams.delete(param)
      })

      // Construct the new URL
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname

      // Replace the current URL without triggering a navigation
      router.replace(newUrl, { scroll: false })
    }
  }, [router, searchParams, paramsToRemove, condition])
}

/**
 * Hook specifically for removing tokens from URL after authentication
 */
export function useRemoveTokenFromUrl(shouldRemove: boolean = true) {
  useCleanupQueryParams(["token", "code", "state"], shouldRemove)
}
