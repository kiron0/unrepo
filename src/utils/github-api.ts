import { GitHubRepo, GitHubUser } from "@/types"
import axios, { AxiosResponse } from "axios"

// Rate limiting utilities
class RateLimiter {
  private requests: number[] = []
  private readonly maxRequests: number
  private readonly timeWindow: number

  constructor(maxRequests: number = 60, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMs
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()

    // Remove requests outside the time window
    this.requests = this.requests.filter((time) => now - time < this.timeWindow)

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.timeWindow - (now - oldestRequest)

      if (waitTime > 0) {
        console.log(`Rate limit approached, waiting ${waitTime}ms`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }

    this.requests.push(now)
  }
}

// GitHub API client with built-in rate limiting and caching
export class GitHubAPIClient {
  private rateLimiter = new RateLimiter()
  private userCache = new Map<string, { data: GitHubUser; timestamp: number }>()
  private reposCache = new Map<
    string,
    { data: GitHubRepo[]; timestamp: number }
  >()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private async makeRequest<T>(url: string, token: string): Promise<T> {
    await this.rateLimiter.waitIfNeeded()

    const response: AxiosResponse<T> = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    return response.data
  }

  async fetchUser(token: string, useCache = true): Promise<GitHubUser | null> {
    try {
      // Check cache first
      if (useCache) {
        const cached = this.userCache.get(token)
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
          return cached.data
        }
      }

      const userData = await this.makeRequest<GitHubUser>(
        "https://api.github.com/user",
        token
      )

      // Cache the result
      this.userCache.set(token, {
        data: userData,
        timestamp: Date.now(),
      })

      return userData
    } catch (error) {
      console.error("Failed to fetch GitHub user:", error)
      return null
    }
  }

  async fetchUserRepos(token: string, useCache = true): Promise<GitHubRepo[]> {
    try {
      // Check cache first
      if (useCache) {
        const cached = this.reposCache.get(token)
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
          return cached.data
        }
      }

      const repos: GitHubRepo[] = []
      let page = 1
      const perPage = 100

      while (true) {
        const url = `https://api.github.com/user/repos?affiliation=owner&per_page=${perPage}&page=${page}`

        await this.rateLimiter.waitIfNeeded()

        const response = await axios.get<GitHubRepo[]>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        })

        repos.push(...response.data)

        const linkHeader = response.headers["link"]
        if (!linkHeader || !linkHeader.includes('rel="next"')) break
        page++
      }

      // Cache the result
      this.reposCache.set(token, {
        data: repos,
        timestamp: Date.now(),
      })

      return repos
    } catch (error) {
      console.error("Failed to fetch GitHub repositories:", error)
      return []
    }
  }

  async fetchUserWithRepos(token: string): Promise<{
    user: GitHubUser | null
    repos: GitHubRepo[]
    stats: {
      privateRepoCount: number
      totalOwnedRepos: number
      publicRepoCount: number
    }
  }> {
    // Fetch user and repos in parallel for better performance
    const [user, repos] = await Promise.all([
      this.fetchUser(token),
      this.fetchUserRepos(token),
    ])

    const stats = {
      privateRepoCount: 0,
      totalOwnedRepos: repos.length,
      publicRepoCount: 0,
    }

    if (user) {
      stats.privateRepoCount = repos.reduce(
        (count, repo) =>
          count + (repo.private && repo.owner.login === user.login ? 1 : 0),
        0
      )
      stats.publicRepoCount = user.public_repos
    }

    return { user, repos, stats }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const user = await this.fetchUser(token, false) // Don't use cache for validation
      return user !== null
    } catch {
      return false
    }
  }

  // Cache management methods
  clearUserCache(token?: string): void {
    if (token) {
      this.userCache.delete(token)
      this.reposCache.delete(token)
    } else {
      this.userCache.clear()
      this.reposCache.clear()
    }
  }

  getCacheStats(): {
    userCacheSize: number
    reposCacheSize: number
  } {
    return {
      userCacheSize: this.userCache.size,
      reposCacheSize: this.reposCache.size,
    }
  }
}

// Export a singleton instance
export const githubAPI = new GitHubAPIClient()

// Convenience functions for backward compatibility
export async function fetchGitHubUserOptimized(
  token: string
): Promise<GitHubUser | null> {
  return githubAPI.fetchUser(token)
}

export async function validateGitHubTokenOptimized(
  token: string
): Promise<boolean> {
  return githubAPI.validateToken(token)
}
