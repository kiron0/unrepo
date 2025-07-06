import { NextRequest, NextResponse } from "next/server"
import { getAccessToken, setValidGitHubToken } from "@/utils/cookies"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL("/sign-in?error=access_denied", request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_failed", request.url)
    )
  }

  try {
    const token = await getAccessToken(code)
    await setValidGitHubToken(token)
    return NextResponse.redirect(new URL("/profile", request.url))
  } catch (err: unknown) {
    console.error(
      "GitHub Token Error:",
      (err as any).response?.data || (err as Error).message
    )
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_failed", request.url)
    )
  }
}
