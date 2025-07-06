import { NextResponse, type NextRequest } from "next/server"
import { siteConfig } from "@/config"

interface MiddlewareConfig {
  protectedRoutes: string[]
  redirectRoutes: Record<string, string>
}

const middlewareConfig: MiddlewareConfig = {
  protectedRoutes: ["/repos", "/profile"],
  redirectRoutes: {
    unauthenticated: "/sign-in",
    authenticated: "/profile",
  },
}

export async function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get(siteConfig.storage.TOKEN.CACHE_KEY)?.value
    const { pathname } = req.nextUrl

    const isProtectedRoute = middlewareConfig.protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (!token && isProtectedRoute) {
      return NextResponse.redirect(
        new URL(middlewareConfig.redirectRoutes.unauthenticated, req.nextUrl)
      )
    }

    if (token && pathname.startsWith("/sign-in")) {
      return NextResponse.redirect(
        new URL(middlewareConfig.redirectRoutes.authenticated, req.nextUrl)
      )
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(
      new URL(
        `${middlewareConfig.redirectRoutes.unauthenticated}?error=server_error`,
        req.nextUrl
      )
    )
  }
}

export const config = {
  matcher: ["/repos", "/profile", "/sign-in"],
}
