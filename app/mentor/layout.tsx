import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout userRole="mentor" userName="Dr. Sarah Wilson">
      {children}
    </AppLayout>
  )
}
