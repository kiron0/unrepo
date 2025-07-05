export interface GitHubUser {
  avatar_url: string
  login: string
  name?: string
  bio?: string
  private_repos_count?: number
  total_owned_repos?: number
  public_repos_count?: number
  public_repos: number
  followers: number
  following: number
}

export interface GitHubRepo {
  private: boolean
  owner: { login: string }
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
