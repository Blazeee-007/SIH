"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "student" | "mentor" | "admin"
  fallbackPath?: string
}

export function AuthGuard({ children, requiredRole, fallbackPath = "/auth/login" }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(fallbackPath)
        return
      }

      if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, router, requiredRole, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") return null

  return <>{children}</>
}
