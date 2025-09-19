"use client"

import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth-context"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={["student", "admin"]}>
      <AppLayout userRole={user?.role || "student"} userName={user?.name || "Student"}>
        {children}
      </AppLayout>
    </ProtectedRoute>
  )
}
