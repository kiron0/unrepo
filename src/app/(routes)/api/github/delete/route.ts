import { NextRequest, NextResponse } from "next/server"
import { getGitHubToken } from "@/utils/cookies"
import axios from "axios"

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = await getGitHubToken()

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fullRepoName } = body

    if (!fullRepoName) {
      return NextResponse.json(
        { error: "Repository name is required" },
        { status: 400 }
      )
    }

    await axios.delete(`https://api.github.com/repos/${fullRepoName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    return NextResponse.json({
      message: `✅ Repository ${fullRepoName} deleted successfully.`,
    })
  } catch (err: any) {
    console.error("Delete Repo Error:", err.response?.data || err.message)
    const status = err.response?.status || 500
    const message = err.response?.data?.message || "Something went wrong"
    return NextResponse.json({ error: message }, { status })
  }
}
