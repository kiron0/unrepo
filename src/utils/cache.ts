import { siteConfig } from "@/config"
import type { GitHubUser } from "@/types"

// Shared cache for access tokens (server-side only)
// In production, consider using Redis or a database for persistence
export const accessTokenCache: { token?: string } = {}

/**
 * Set cached user data in localStorage
 */
export function setCachedUserData(userData: GitHubUser): void {
  if (typeof window === "undefined") return

  try {
    const expiry = Date.now() + Number(siteConfig.storage.USER.CACHE_DURATION)
    localStorage.setItem(
      siteConfig.storage.USER.CACHE_KEY,
      JSON.stringify(userData)
    )
    localStorage.setItem(
      siteConfig.storage.USER.CACHE_EXPIRY_KEY,
      expiry.toString()
    )
  } catch (error) {
    console.error("Error setting cached user data:", error)
  }
}

/**
 * Get cached user data from localStorage
 */
export function getCachedUserData(): GitHubUser | null {
  if (typeof window === "undefined") return null

  try {
    const cachedData = localStorage.getItem(siteConfig.storage.USER.CACHE_KEY)
    const cachedExpiry = localStorage.getItem(
      siteConfig.storage.USER.CACHE_EXPIRY_KEY
    )

    if (!cachedData || !cachedExpiry) return null

    const expiryTime = parseInt(cachedExpiry)
    if (Date.now() > expiryTime) {
      clearCachedUserData()
      return null
    }

    return JSON.parse(cachedData)
  } catch (error) {
    console.error("Error getting cached user data:", error)
    clearCachedUserData()
    return null
  }
}

/**
 * Clear cached user data from localStorage
 */
export async function clearCachedUserData(): Promise<void> {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(siteConfig.storage.USER.CACHE_KEY)
    localStorage.removeItem(siteConfig.storage.USER.CACHE_EXPIRY_KEY)
  } catch (error) {
    console.error("Error clearing cached user data:", error)
  }
}

/**
 * Check if cached user data exists and is valid
 */
export function hasCachedUserData(): boolean {
  if (typeof window === "undefined") return false

  try {
    const cachedData = localStorage.getItem(siteConfig.storage.USER.CACHE_KEY)
    const cachedExpiry = localStorage.getItem(
      siteConfig.storage.USER.CACHE_EXPIRY_KEY
    )

    if (!cachedData || !cachedExpiry) return false

    const expiryTime = parseInt(cachedExpiry)
    return Date.now() <= expiryTime
  } catch (error) {
    console.error("Error checking cached user data:", error)
    return false
  }
}
