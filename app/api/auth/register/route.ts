import { type NextRequest, NextResponse } from "next/server"
import { registerUser, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate role
    if (!["student", "mentor"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Register user
    const user = await registerUser(email, password, name, role)
    if (!user) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const token = await generateToken(user)

    // Return success response with token and user data
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
