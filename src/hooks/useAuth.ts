"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { authApi } from "../lib/api"

interface AuthContextType {
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const useAuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await authApi.verifyToken()
        setIsAuthenticated(isValid)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    try {
      await authApi.login(credentials)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    authApi.logout()
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    login,
    logout,
    loading,
  }
}

export { AuthContext }
