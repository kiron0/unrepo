export interface GitHubUser {
  avatar_url: string
  login: string
  name?: string
  bio?: string
  public_repos: number
  followers: number
  following: number
}

export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  html_url: string
  updated_at: string
  language: string | null
  stargazers_count: number
  forks_count: number
}

export interface CacheConfig {
  key: string
  expiryKey: string
  duration: number
}

export interface CookieConfig {
  expires?: Date
  path?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
}
