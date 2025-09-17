import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout userRole="admin" userName="System Administrator">
      {children}
    </AppLayout>
  )
}
