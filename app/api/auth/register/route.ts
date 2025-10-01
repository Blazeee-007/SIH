import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/services/authService"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, phone, bio, skills } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Email, password, name, and role are required" }, { status: 400 })
    }

    if (!["student", "mentor"].includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be either student or mentor" }, { status: 400 })
    }

    const result = await registerUser({ email, password, name, role, phone, bio, skills })

    if ('error' in result) {
      const status = result.error.includes('already exists') ? 409 : 400
      return NextResponse.json({ error: result.error }, { status })
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
    }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
