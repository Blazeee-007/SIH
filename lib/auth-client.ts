"use client"

import Cookies from "js-cookie"

export interface ClientUser {
  id: string
  email: string
  name: string
  role: "student" | "mentor" | "admin"
}

// Client-side token management (no verification, just storage)
export function getStoredToken(): string | null {
  return Cookies.get("auth-token") || null
}

export function setStoredToken(token: string): void {
  Cookies.set("auth-token", token, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

export function removeStoredToken(): void {
  Cookies.remove("auth-token")
}

// Verify token by calling the server API
export async function verifyTokenWithServer(): Promise<ClientUser | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    })

    if (response.ok) {
      const data = await response.json()
      return data.user
    }

    return null
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
