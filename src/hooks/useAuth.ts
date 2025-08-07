"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { authApi } from "../lib/api"

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const useAuthProvider = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("access")
        if (accessToken) {
          // Try to verify token with API, fallback to simple check
          try {
            const isValid = await authApi.verifyToken()
            setIsAuthenticated(isValid)
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
  }

  return {
    isAuthenticated,
    loading,
    login,
    logout,
  }
}
