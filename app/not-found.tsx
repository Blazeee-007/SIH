import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
