import { NextResponse } from "next/server"
import { getGitHubToken, removeGitHubToken } from "@/utils/cookies"
import axios from "axios"

export async function GET(request: Request) {
  try {
    const accessToken = await getGitHubToken()
    if (!accessToken) {
      await removeGitHubToken()
      return NextResponse.json(
        {
          error: "access_token_missing",
          redirectTo: "/sign-in?error=access_token_missing",
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("q") || searchParams.get("search")

    const defaultParams: Record<string, any> = {
      per_page: 100,
      page: 1,
      affiliation: "owner",
    }

    for (const [key, value] of searchParams.entries()) {
      if (key === "q" || key === "search") continue
      defaultParams[key] = ["per_page", "page"].includes(key)
        ? Number(value) || value
        : value
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    }

    let apiUrl = "https://api.github.com/user/repos"
    let params = { ...defaultParams }

    if (searchQuery) {
      const { data: user } = await axios.get("https://api.github.com/user", {
        headers,
      })
      apiUrl = "https://api.github.com/search/repositories"
      params = {
        ...defaultParams,
        q: `${searchQuery} user:${user.login}`,
      }
      delete params.affiliation
    }

    const { data } = await axios.get(apiUrl, { headers, params })
    const responseData = searchQuery ? data.items : data

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error(
      "Error fetching repositories:",
      error?.response?.data || error
    )

    // If we get a 401 error, remove the token and return auth error
    if (error?.response?.status === 401) {
      await removeGitHubToken()
      return NextResponse.json(
        {
          error: "bad_credentials",
          redirectTo: "/sign-in?error=bad_credentials",
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    )
  }
}
