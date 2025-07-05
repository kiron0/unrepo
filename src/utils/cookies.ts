"use server"

import { cookies } from "next/headers"
import { siteConfig } from "@/config"
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
    return cookieStore.get(siteConfig.storage.TOKEN)?.value || null
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
    cookieStore.set(siteConfig.storage.TOKEN, token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      path: "/",
      secure: true,
      sameSite: "strict",
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
    cookieStore.delete(siteConfig.storage.TOKEN)
    return true
  } catch (error) {
    console.error("Error removing GitHub token from cookies:", error)
    return false
  }
}

/**
 * Validate GitHub token by making a test API call
 */
export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    return response.status === 200
  } catch (error) {
    console.error("Token validation failed:", error)
    return false
  }
}

/**
 * Set GitHub token in cookies only if it's valid
 */
export async function setValidGitHubToken(token: string): Promise<boolean> {
  try {
    const isValid = await validateGitHubToken(token)
    if (isValid) {
      return await setGitHubToken(token)
    }
    return false
  } catch (error) {
    console.error("Error setting valid GitHub token:", error)
    return false
  }
}
