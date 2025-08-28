'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { User, LogOut, Settings, ChevronDown, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserData {
  firstName?: string
  lastName?: string
  email?: string
}

export function Header() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    
    if (user && token) {
      try {
        const userData = JSON.parse(user)
        setUserData(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('authToken')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    setUserData(null)
    setIsMenuOpen(false)
    router.push('/')
  }

  const handleProfileClick = () => {
    if (userData) {
      router.push('/dashboard')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/100">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Peligent</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Features
          </Link>
          <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
            About
          </Link>
          <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {userData ? (
            // User is logged in - show profile menu
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {userData.firstName?.[0] || userData.email?.[0] || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900">
                    {userData.firstName || 'User'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {userData.email}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                    <p className="text-sm font-semibold text-slate-900">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-sm text-slate-600">{userData.email}</p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/dashboard')
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-purple-600" />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-slate-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in - show login/signup buttons
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  )
}
