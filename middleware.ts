import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Define protected routes
const protectedRoutes = ["/student", "/mentor", "/admin"]
const authRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If accessing protected route with token, verify it
  if (isProtectedRoute && token) {
    try {
      const payload = await verifyToken(token)

      // Invalid token, redirect to login
      if (!payload) {
        const response = NextResponse.redirect(new URL("/auth/login", request.url))
        response.cookies.delete("auth-token")
        return response
      }

      // Check role-based access
      const userRole = payload.role

      if (pathname.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      if (pathname.startsWith("/mentor") && userRole !== "mentor" && userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      if (pathname.startsWith("/student") && userRole !== "student" && userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    } catch (error) {
      console.error("Token verification error in middleware:", error)
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  if (isAuthRoute && token && request.method === "GET") {
    try {
      const payload = await verifyToken(token)
      if (payload) {
        const dashboardUrl = `/${payload.role}/dashboard`
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
      }
    } catch (error) {
      console.error("Token verification error for auth route:", error)
      // Don't redirect, let them access the auth page
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)"],
}
