"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  verifyTokenWithServer,
  type ClientUser,
} from "./auth-client"

interface AuthContextType {
  user: ClientUser | null
  login: (token: string, user: ClientUser) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken()
      if (token) {
        const userData = await verifyTokenWithServer()
        if (userData) {
          setUser(userData)
        } else {
          // Invalid token, remove it
          removeStoredToken()
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (token: string, userData: ClientUser) => {
    setStoredToken(token)
    setUser(userData)
  }

  const logout = () => {
    removeStoredToken()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
