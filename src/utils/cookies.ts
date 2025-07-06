"use server"

import { cookies } from "next/headers"
import { siteConfig } from "@/config"
import { GitHubUser } from "@/types"
import axios, { AxiosResponse } from "axios"

export async function getAccessToken(code: string): Promise<string> {
  return axios
    .post<{ access_token: string }>(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID as string,
        client_secret: process.env.GITHUB_CLIENT_SECRET as string,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    )
    .then((response: AxiosResponse<{ access_token: string }>) => {
      return response.data.access_token
    })
    .catch((error) => {
      console.error("Error getting access token:", error)
      throw error
    })
}

/**
 * Get GitHub token from cookies asynchronously
 */
export async function getGitHubToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(siteConfig.storage.TOKEN.CACHE_KEY)?.value || null
  } catch (error) {
    console.error("Error getting GitHub token from cookies:", error)
    return null
  }
}

/**
 * Set GitHub token in cookies asynchronously
 */
export async function setGitHubToken(token: string): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(siteConfig.storage.TOKEN.CACHE_KEY, token, {
      expires: siteConfig.storage.TOKEN.CACHE_DURATION,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })
    return true
  } catch (error) {
    console.error("Error setting GitHub token in cookies:", error)
    return false
  }
}

/**
 * Remove GitHub token from cookies asynchronously
 */
export async function removeGitHubToken(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(siteConfig.storage.TOKEN.CACHE_KEY)
    return true
  } catch (error) {
    console.error("Error removing GitHub token from cookies:", error)
    return false
  }
}

// Cache for validated tokens to avoid redundant API calls
const tokenValidationCache = new Map<
  string,
  { isValid: boolean; timestamp: number }
>()
const VALIDATION_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Validate GitHub token by making a test API call with caching
 */
export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    // Check cache first
    const cached = tokenValidationCache.get(token)
    if (cached && Date.now() - cached.timestamp < VALIDATION_CACHE_DURATION) {
      return cached.isValid
    }

    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    const isValid = response.status === 200

    // Cache the result
    tokenValidationCache.set(token, {
      isValid,
      timestamp: Date.now(),
    })

    return isValid
  } catch (error) {
    console.error("Token validation failed:", error)

    // Cache failed validation for a shorter time
    tokenValidationCache.set(token, {
      isValid: false,
      timestamp: Date.now(),
    })

    return false
  }
}

/**
 * Set GitHub token in cookies only if it's valid
 */
export async function setValidGitHubToken(token: string): Promise<boolean> {
  try {
    // Use the optimized validation function
    const isValid = await validateGitHubTokenOptimized(token)
    if (isValid) {
      return await setGitHubToken(token)
    }
    return false
  } catch (error) {
    console.error("Error setting valid GitHub token:", error)
    return false
  }
}

// Server-side cache for user data
const userDataCache = new Map<string, { data: GitHubUser; timestamp: number }>()
const USER_DATA_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Pending requests map to prevent duplicate API calls
const pendingUserRequests = new Map<string, Promise<GitHubUser>>()

/**
 * Fetch GitHub user data with advanced caching and deduplication
 */
export async function fetchGitHubUser(
  token: string
): Promise<GitHubUser | null> {
  try {
    // Check server-side cache first
    const cached = userDataCache.get(token)
    if (cached && Date.now() - cached.timestamp < USER_DATA_CACHE_DURATION) {
      return cached.data
    }

    // Check if there's already a pending request for this token
    if (pendingUserRequests.has(token)) {
      return await pendingUserRequests.get(token)!
    }

    // Create the request promise
    const requestPromise = axios
      .get<GitHubUser>("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
      .then((response) => {
        const userData = response.data

        // Cache the successful response
        userDataCache.set(token, {
          data: userData,
          timestamp: Date.now(),
        })

        // Also cache the token as valid
        tokenValidationCache.set(token, {
          isValid: true,
          timestamp: Date.now(),
        })

        return userData
      })
      .finally(() => {
        // Remove from pending requests
        pendingUserRequests.delete(token)
      })

    // Store the pending request
    pendingUserRequests.set(token, requestPromise)

    return await requestPromise
  } catch (error) {
    console.error("Failed to fetch GitHub user:", error)

    // Cache failed validation
    tokenValidationCache.set(token, {
      isValid: false,
      timestamp: Date.now(),
    })

    return null
  }
}

/**
 * Enhanced validation that reuses user data fetch
 */
export async function validateGitHubTokenOptimized(
  token: string
): Promise<boolean> {
  try {
    // Try to fetch user data (which includes validation)
    const userData = await fetchGitHubUser(token)
    return userData !== null
  } catch (error) {
    console.error("Token validation failed:", error)
    return false
  }
}
