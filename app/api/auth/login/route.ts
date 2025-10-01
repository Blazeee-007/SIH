import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/services/authService"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await authenticateUser(email, password)

    if ('error' in result) {
      const status = result.error.includes('locked') || result.error.includes('deactivated') ? 403 : 401
      return NextResponse.json({ error: result.error }, { status })
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
