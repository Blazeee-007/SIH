"use client"

import { getStoredToken, removeStoredToken } from "./auth-client"

interface RequestConfig extends RequestInit {
  skipAuth?: boolean
}

class HttpClient {
  private baseURL: string

  constructor(baseURL = "") {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { skipAuth = false, ...requestConfig } = config

    const url = `${this.baseURL}${endpoint}`
    const token = getStoredToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...requestConfig.headers,
    }

    // Add auth header if token exists and not skipping auth
    if (token && !skipAuth) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...requestConfig,
      headers,
      credentials: "include",
    })

    // Handle 401 responses (token expired/invalid)
    if (response.status === 401 && !skipAuth) {
      removeStoredToken()

      // Redirect to login if not already on auth page
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login"
      }

      throw new Error("Authentication required")
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" })
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" })
  }
}

// Export singleton instance
export const httpClient = new HttpClient()

// Export for custom instances
export { HttpClient }
