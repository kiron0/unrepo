import { NextResponse } from "next/server"
import { getGitHubToken } from "@/utils/cookies"
import { githubAPI } from "@/utils/github-api"

export async function GET() {
  try {
    const accessToken = await getGitHubToken()
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      )
    }

    // Use the optimized GitHub API client that handles caching, rate limiting, and fetches everything
    const result = await githubAPI.fetchUserWithRepos(accessToken)

    if (!result.user) {
      return NextResponse.json(
        { error: "Failed to fetch user data or invalid token" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      ...result.user,
      private_repos_count: result.stats.privateRepoCount,
      total_owned_repos: result.stats.totalOwnedRepos,
      public_repos_count: result.stats.publicRepoCount,
    })
  } catch (error) {
    const message = (error as Error).message
    console.error("User Fetch Error:", message)
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    )
  }
}
