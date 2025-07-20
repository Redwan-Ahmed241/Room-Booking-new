"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Settings } from "lucide-react"
import Logo from "./logo"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/rooms" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
              Rooms
            </Link>
            <Link href="/villas" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
              Villas
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-700 hover:text-primary-600 hover:bg-primary-50">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
              Sign Up
            </Button>
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 hover:text-primary-600 hover:bg-primary-50"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/rooms" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
                Rooms
              </Link>
              <Link href="/villas" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
                Villas
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-primary-600 transition-colors font-medium">
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-slate-700 hover:text-primary-600 hover:bg-primary-50"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Sign Up
                </Button>
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
