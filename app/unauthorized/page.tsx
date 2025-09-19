import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-sm text-gray-600">You don't have permission to access this page.</p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/auth/login">Login with Different Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
