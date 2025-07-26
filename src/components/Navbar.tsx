"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, Globe } from "lucide-react"
import Logo from "./Logo"
import { useAuth } from "../hooks/useAuth"

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/" ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/rooms" ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
              }`}
            >
              Rooms
            </Link>
            {isAuthenticated && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/admin" ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-pink-500 transition-colors">
              <Globe className="h-4 w-4" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow"
              >
                <Menu className="h-4 w-4 text-gray-700" />
                <User className="h-6 w-6 text-gray-700 bg-gray-200 rounded-full p-1" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/admin/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Admin Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-pink-500 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link
                to="/"
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/" ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/rooms" ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Rooms
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className={`block px-4 py-2 text-sm font-medium transition-colors ${
                      location.pathname === "/admin" ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
