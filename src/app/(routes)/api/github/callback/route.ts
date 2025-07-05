import { NextRequest, NextResponse } from "next/server"
import { getAccessToken, setGitHubToken } from "@/utils/cookies"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code missing" },
      { status: 400 }
    )
  }

  try {
    const token = await getAccessToken(code)
    await setGitHubToken(token)

    const clientURL = process.env.CLIENT_URL || "http://localhost:3000"
    return NextResponse.redirect(`${clientURL}/profile?token=${token}`)
  } catch (err: any) {
    console.error("GitHub Token Error:", err.response?.data || err.message)
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    )
  }
}
