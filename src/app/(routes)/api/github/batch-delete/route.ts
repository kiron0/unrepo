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
    const { repoNames } = body

    if (!repoNames || !Array.isArray(repoNames) || repoNames.length === 0) {
      return NextResponse.json(
        {
          error: "Repository names array is required",
        },
        { status: 400 }
      )
    }

    const results = {
      successful: [] as string[],
      failed: [] as Array<{ repoName: string; error: string }>,
    }

    for (const repoName of repoNames) {
      try {
        await axios.delete(`https://api.github.com/repos/${repoName}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        })
        results.successful.push(repoName)
      } catch (err: any) {
        console.error(
          `Error deleting ${repoName}:`,
          err.response?.data || err.message
        )
        results.failed.push({
          repoName,
          error: err.response?.data?.message || "Failed to delete",
        })
      }
    }

    return NextResponse.json({
      message: `Deleted ${results.successful.length} of ${repoNames.length} repositories`,
      results,
    })
  } catch (err: any) {
    console.error("Batch Delete Error:", err.response?.data || err.message)
    return NextResponse.json(
      {
        error: "Failed to process batch deletion",
      },
      { status: 500 }
    )
  }
}
