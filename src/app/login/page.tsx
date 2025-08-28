'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  // Handle OAuth callback with tokens and user data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')
    const userParam = urlParams.get('user')

    if (accessToken && refreshToken && userParam) {
      try {
        // Store tokens
        localStorage.setItem('token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        // Parse and store user data
        const userData = JSON.parse(decodeURIComponent(userParam))


        const userDataEnd = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }

        // console.log(userData)

        localStorage.setItem('user', JSON.stringify(userDataEnd))

        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname)

        // Redirect to dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('Error parsing OAuth callback:', error)
        setErrors({ general: 'Error processing OAuth login. Please try again.' })
      }
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {


      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const url = `${baseUrl}/api/auth/login`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
        mode: 'cors',
      })

      if (!response.ok) {
        let message = 'Login failed. Please check your credentials.'
        try {
          const errJson = await response.json()
          if (errJson?.message) message = errJson.message
        } catch {}
        throw new Error(message)
      }

      const data = await response.json()
      console.log('Login success:', data)
      


      if(response.ok){
          if(data.success){
            localStorage.setItem('authToken', data.tokens.accessToken)
            const userData = {
              email: data.user.email,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              isEmailVerified: data.user.isEmailVerified,
            }

            localStorage.setItem('user', JSON.stringify(userData))
            router.push('/dashboard')
          }



      }

      // Redirect or handle successful login
      // router.push('/dashboard')
      
    } catch (error: unknown) {
      console.error('Login error:', error)
      const message = error instanceof Error ? error.message : 'Login error. Please try again.'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
    if (!baseUrl) {
      setErrors({ general: 'Missing NEXT_PUBLIC_API_URL. Please configure your backend URL.' })
      return
    }

    if (provider === 'google') {
      const oauthUrl = `${baseUrl}/api/auth/google`
      window.location.href = oauthUrl
      return
    }

    // Example for other providers if needed later
    if (provider === 'github') {
      const oauthUrl = `${baseUrl}/api/auth/github`
      window.location.href = oauthUrl
      return
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border border-slate-200 bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
            </div>
            <CardTitle className="text-2xl text-slate-900">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full text-slate-900" 
                onClick={() => handleSocialLogin('google')}
              >
                <Chrome className="h-5 w-5 mr-2" />
                Sign in with Google
              </Button>
            
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-600">or</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pr-10 pl-10 py-2 border rounded-md bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 ${
                      errors.email ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="you@example.com"
                    
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pr-10 pl-10 py-2 border rounded-md bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 ${
                      errors.password ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="Enter your password"
                   
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 pl-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-600 hover:text-slate-800" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-600 hover:text-slate-800" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-700 focus:ring-blue-700 border-slate-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-800">
                    Remember me
                  </label>
                </div>
                <Link 
                  href="/reset-password" 
                  className="text-sm text-blue-700 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-slate-700">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/signup" 
                  className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-700 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-700 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
