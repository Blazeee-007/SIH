"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Something went wrong!</h2>
          <p className="mt-2 text-sm text-gray-600">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          {error.digest && <p className="mt-2 text-xs text-gray-500">Error ID: {error.digest}</p>}
        </div>
        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
