import { verifyToken } from "./auth"

// Token refresh utility for client-side token validation
export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token)
    if (!payload || !payload.exp) return true

    // Check if token expires within the next 5 minutes
    const fiveMinutesFromNow = Math.floor(Date.now() / 1000) + 5 * 60
    return payload.exp < fiveMinutesFromNow
  } catch {
    return true
  }
}

// Auto-refresh token before expiration
export async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    })

    return response.ok
  } catch {
    return false
  }
}

// Check if user needs to re-authenticate
export async function checkAuthStatus(): Promise<{ isValid: boolean; needsRefresh: boolean }> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    })

    if (response.ok) {
      return { isValid: true, needsRefresh: false }
    } else if (response.status === 401) {
      return { isValid: false, needsRefresh: true }
    } else {
      return { isValid: false, needsRefresh: false }
    }
  } catch {
    return { isValid: false, needsRefresh: false }
  }
}
