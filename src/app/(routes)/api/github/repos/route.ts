import { NextRequest, NextResponse } from "next/server"
import { getGitHubToken, removeGitHubToken } from "@/utils/cookies"
import axios, { AxiosError } from "axios"

interface GitHubParams {
  per_page?: number
  page?: number
  affiliation?: string
  q?: string
  [key: string]: string | number | undefined
}

interface GitHubErrorResponse {
  message: string
  documentation_url?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)
  const searchQuery = searchParams.get("q") || searchParams.get("search")

  try {
    const accessToken = await getGitHubToken()
    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required: No access token found" },
        { status: 401 }
      )
    }

    const params: GitHubParams = {
      affiliation: "owner",
      ...Object.fromEntries(
        [...searchParams.entries()].filter(
          ([key]) => !["q", "search"].includes(key)
        )
      ),
    }

    if (!params.per_page) params.per_page = 30
    if (!params.page) params.page = 1
    if (!params.sort) params.sort = "updated"
    if (!params.direction) params.direction = "desc"
    ;["per_page", "page"].forEach((key) => {
      if (params[key]) params[key] = Number(params[key])
    })

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    }

    const apiUrl = searchQuery
      ? "https://api.github.com/search/repositories"
      : "https://api.github.com/user/repos"

    if (searchQuery) {
      const { data: user } = await axios.get<{ login: string }>(
        "https://api.github.com/user",
        { headers }
      )
      params.q = `${searchQuery} user:${user.login}`
      delete params.affiliation
    }

    const { data } = await axios.get(apiUrl, { headers, params })
    return NextResponse.json(searchQuery ? data.items : data)
  } catch (error) {
    const axiosError = error as AxiosError<GitHubErrorResponse>

    if (axiosError.response) {
      const { status, data } = axiosError.response

      if ([401, 307].includes(status)) {
        await removeGitHubToken()
        return NextResponse.json(
          { error: "Authentication failed: Invalid or expired credentials" },
          { status: 401 }
        )
      }

      if (status === 403 && data.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "GitHub API rate limit exceeded. Please try again later.",
            documentation:
              data.documentation_url || "https://docs.github.com/en/rest",
          },
          { status: 429 }
        )
      }

      if (status === 404) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        )
      }

      if (status >= 500) {
        return NextResponse.json(
          { error: "GitHub API server error", details: data.message },
          { status: 502 }
        )
      }
    }

    console.error(
      "Error fetching repositories:",
      axiosError.message,
      axiosError.response?.data
    )
    return NextResponse.json(
      { error: "Failed to fetch repositories", details: axiosError.message },
      { status: 500 }
    )
  }
}
