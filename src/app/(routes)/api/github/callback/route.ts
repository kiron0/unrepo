import { NextRequest, NextResponse } from "next/server"
import { getAccessToken, setValidGitHubToken } from "@/utils"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)

  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL("/sign-in?error=access_denied", request.nextUrl)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_failed", request.nextUrl)
    )
  }

  try {
    const token = await getAccessToken(code)
    await setValidGitHubToken(token)
    const profileUrl = new URL("/profile", request.nextUrl)
    const response = NextResponse.redirect(profileUrl)
    return response
  } catch (err: unknown) {
    console.error(
      "GitHub Token Error:",
      (err as any).response?.data || (err as Error).message
    )
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_failed", request.nextUrl)
    )
  }
}
