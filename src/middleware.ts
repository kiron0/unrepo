import { NextResponse, type NextRequest } from "next/server"
import { siteConfig } from "@/config"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(siteConfig.storage.TOKEN.CACHE_KEY)?.value

  const path = req.nextUrl.pathname

  if (!token && (path.startsWith("/repos") || path.startsWith("/profile"))) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (token && path === "/login") {
    return NextResponse.redirect(new URL("/profile", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/repos", "/login", "/profile"],
}
