"use client"

import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth-context"

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={["mentor", "admin"]}>
      <AppLayout userRole={user?.role || "mentor"} userName={user?.name || "Mentor"}>
        {children}
      </AppLayout>
    </ProtectedRoute>
  )
}
