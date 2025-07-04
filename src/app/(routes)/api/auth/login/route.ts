import { NextResponse } from "next/server"

export async function GET() {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo delete_repo`
  return NextResponse.redirect(redirectUrl)
}
