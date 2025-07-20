"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, Globe, BombIcon as Balloon, UtensilsCrossed, Home } from "lucide-react"
import Logo from "./Logo"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Center Navigation - Airbnb Style */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Link
                to="/"
                className={`flex items-center px-6 py-3 text-sm font-medium rounded-full transition-colors ${
                  isActive("/") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Homes
              </Link>

              <div className="w-px h-6 bg-gray-300" />

              <Link
                to="/experiences"
                className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative"
              >
                <Balloon className="w-4 h-4 mr-2" />
                Experiences
                <Badge className="ml-2 bg-pink-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>
              </Link>

              <div className="w-px h-6 bg-gray-300" />

              <Link
                to="/services"
                className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Services
                <Badge className="ml-2 bg-pink-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>
              </Link>
            </div>
          </div>

          {/* Right Side - User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:bg-gray-50">
              Become a host
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-50">
              <Globe className="w-4 h-4" />
            </Button>

            <div className="flex items-center border border-gray-300 rounded-full p-1 hover:shadow-md transition-shadow cursor-pointer">
              <Menu className="w-4 h-4 ml-3 mr-2 text-gray-700" />
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-1">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive("/") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-3" />
                Homes
              </Link>

              <Link
                to="/experiences"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Balloon className="w-5 h-5 mr-3" />
                Experiences
                <Badge className="ml-2 bg-pink-500 text-white text-xs">NEW</Badge>
              </Link>

              <Link
                to="/services"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <UtensilsCrossed className="w-5 h-5 mr-3" />
                Services
                <Badge className="ml-2 bg-pink-500 text-white text-xs">NEW</Badge>
              </Link>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                  Become a host
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50 mt-2">
                  <User className="w-4 h-4 mr-2" />
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
