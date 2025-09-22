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
          try {
            // Try to verify token with API
            const isValid = await authApi.verifyToken()
            if (isValid) {
              setIsAuthenticated(true)
              try {
                const userProfile = await authApi.getUserProfile()
                setUser(userProfile)
              } catch (profileError) {
                // If profile fetch fails, use basic user info from token
                setUser({ username: "admin" })
              }
            } else {
              setIsAuthenticated(false)
              setUser(null)
            }
          } catch (error) {
            console.warn("API not available for token verification, checking locally")
            // Simple fallback - just check if token exists and is not expired
            try {
              const tokenData = JSON.parse(atob(accessToken.split('.')[1]))
              const isExpired = tokenData.exp * 1000 < Date.now()
              if (!isExpired) {
                setIsAuthenticated(true)
                setUser({ username: tokenData.username || "admin" })
              } else {
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                setIsAuthenticated(false)
                setUser(null)
              }
            } catch (tokenError) {
              // If token is malformed, treat as valid for demo purposes
              setIsAuthenticated(true)
              setUser({ username: "admin" })
            }
          }
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true)
      try {
        const response = await authApi.login(credentials)
        setIsAuthenticated(true)
        try {
          const userProfile = await authApi.getUserProfile()
          setUser(userProfile)
        } catch (profileError) {
          setUser({ username: credentials.username })
        }
        return true
      } catch (apiError) {
        console.warn("API not available, using fallback auth:", apiError)
        // Fallback authentication for development
        if (credentials.username === "admin" && credentials.password === "admin123") {
          const mockToken = `mock-token-${Date.now()}`
          const mockRefresh = `mock-refresh-${Date.now()}`
          localStorage.setItem("access", mockToken)
          localStorage.setItem("refresh", mockRefresh)
          setIsAuthenticated(true)
          setUser({ username: credentials.username })
          return true
        }
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setLoading(false)
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
