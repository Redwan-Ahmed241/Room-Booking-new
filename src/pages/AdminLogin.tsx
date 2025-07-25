"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, User, Eye, EyeOff } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

interface AdminLoginProps {
  onLogin: () => void
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Demo credentials - in a real app, this would be handled by a backend
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === ADMIN_CREDENTIALS.username && credentials.password === ADMIN_CREDENTIALS.password) {
      onLogin()
      navigate("/admin")
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-pink-500 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    required
                    value={credentials.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pl-10"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Demo credentials info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-blue-700">
                <p>
                  <strong>Username:</strong> admin
                </p>
                <p>
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
