import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout userRole="student" userName="Alex Johnson">
      {children}
    </AppLayout>
  )
}
