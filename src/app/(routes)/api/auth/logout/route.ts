import { NextResponse } from "next/server"
import { removeGitHubToken } from "@/utils/cookies"

export async function POST() {
  try {
    await removeGitHubToken()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing token from cookies:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
