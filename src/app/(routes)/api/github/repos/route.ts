import { NextResponse } from "next/server"
import { getGitHubToken } from "@/utils/cookies"
import axios from "axios"

export async function GET(request: Request) {
  try {
    const accessToken = await getGitHubToken()
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
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
    console.error("Repo Fetch Error:", error.response?.data || error.message)
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    )
  }
}
