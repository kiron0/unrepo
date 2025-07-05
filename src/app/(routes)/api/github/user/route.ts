import { NextResponse } from "next/server"
import { GitHubRepo, GitHubUser } from "@/types"
import { getGitHubToken } from "@/utils/cookies"
import axios, { AxiosError } from "axios"

export async function GET() {
  try {
    const accessToken = await getGitHubToken()
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      )
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    }

    const { data: user } = await axios.get<GitHubUser>(
      "https://api.github.com/user",
      { headers }
    )

    const repos: GitHubRepo[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const { data: pageRepos, headers: responseHeaders } = await axios.get<
        GitHubRepo[]
      >("https://api.github.com/user/repos", {
        headers,
        params: { affiliation: "owner", per_page: perPage, page },
      })

      repos.push(...pageRepos)
      const linkHeader = responseHeaders["link"]
      if (!linkHeader || !linkHeader.includes('rel="next"')) break
      page++
    }

    const privateRepoCount = repos.reduce(
      (count, repo) =>
        count + (repo.private && repo.owner.login === user.login ? 1 : 0),
      0
    )

    return NextResponse.json({
      ...user,
      private_repos_count: privateRepoCount,
      total_owned_repos: repos.length,
      public_repos_count: user.public_repos,
    })
  } catch (error) {
    const message =
      (error as AxiosError).response?.data || (error as Error).message
    console.error("User Fetch Error:", message)
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    )
  }
}
