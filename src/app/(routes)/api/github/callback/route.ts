import { NextRequest, NextResponse } from "next/server"
import { getBaseURL } from "@/utils/base-url"
import { getAccessToken, setValidGitHubToken } from "@/utils/cookies"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  const clientUrl = await getBaseURL()

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=access_denied", request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", request.url)
    )
  }

  try {
    const token = await getAccessToken(code)
    await setValidGitHubToken(token)
    return NextResponse.redirect(
      `${clientUrl || "http://localhost:3000"}/profile`
    )
  } catch (err: unknown) {
    console.error(
      "GitHub Token Error:",
      (err as any).response?.data || (err as Error).message
    )
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", request.url)
    )
  }
}
