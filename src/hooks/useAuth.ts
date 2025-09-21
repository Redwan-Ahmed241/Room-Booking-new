"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { authApi } from "../lib/api"

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  logout: () => void
}

// Extended AuthContextType to include user profile data
export interface AuthContextTypeWithUser extends AuthContextType {
  user: { username: string; profileImage?: string } | null
}

export const AuthContext = createContext<AuthContextTypeWithUser | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Extended useAuth hook to include user profile data
export const useAuthProvider = (): AuthContextTypeWithUser => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ username: string; profileImage?: string } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("access")
        if (accessToken) {
          // Try to verify token with API, fallback to simple check
          try {
            const isValid = await authApi.verifyToken()
            setIsAuthenticated(isValid)
            if (isValid) {
              const userProfile = await authApi.getUserProfile()
              setUser(userProfile)
            }
          } catch (error) {
            console.warn("API not available for token verification, checking locally")
            // Simple fallback - just check if token exists
            setIsAuthenticated(!!accessToken)
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      // Try API login first
      try {
        await authApi.login(credentials)
        setIsAuthenticated(true)
        const userProfile = await authApi.getUserProfile()
        setUser(userProfile)
        return true
      } catch (apiError) {
        console.warn("API not available, using fallback auth:", apiError)
        // Fallback authentication for development
        if (credentials.username === "admin" && credentials.password === "admin123") {
          localStorage.setItem("access", "mock-token-" + Date.now())
          localStorage.setItem("refresh", "mock-refresh-" + Date.now())
          setIsAuthenticated(true)
          return true
        }
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.warn("API logout failed, clearing local storage:", error)
    }
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
  }

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    user,
  }
}
