'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft, User, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToNewsletter: false
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password: string) => {
    let score = 0
    let feedback = ''

    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score === 0) feedback = 'Very Weak'
    else if (score === 1) feedback = 'Weak'
    else if (score === 2) feedback = 'Fair'
    else if (score === 3) feedback = 'Good'
    else if (score === 4) feedback = 'Strong'
    else feedback = 'Excellent'

    setPasswordStrength({ score, feedback })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms of service'
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
      const url = `${baseUrl}/api/auth/register`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors',
      })  

      if (!response.ok) {
        let message = 'Signup failed. Please try again.'
        try {
          const errJson = await response.json()
          if (errJson?.message) message = errJson.message
          if (errJson?.error) message = errJson.error
        } catch {}
        throw new Error(message)
      }

      const data = await response.json()
      console.log('Signup success:', data)

      if(response.ok){
        if(data.success){
          const userData = {
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            isEmailVerified: data.user.isEmailVerified,
          }

          localStorage.setItem('user', JSON.stringify(userData))

          if(! data.user.isEmailVerified){
            router.push('/otp')
          }else{
            router.push('/dashboard')
          }
        }
      }

    } catch (error: unknown) {
      setErrors({ general: error instanceof Error ? error.message : 'Signup error. Please try again.' })
    } finally {
      setIsLoading(false)
    } 
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    setErrors({}) // Clear previous errors
    
    try {
      // Use server-side OAuth flow
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const googleAuthUrl = `${baseUrl}/api/auth/google`
      
      // Redirect to Google OAuth endpoint
      window.location.href = googleAuthUrl
      
    } catch (error) {
      console.error('Google signup error:', error)
      setErrors({ general: 'Google signup failed. Please try again.' })
      setIsGoogleLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'text-red-600'
    if (passwordStrength.score <= 2) return 'text-orange-600'
    if (passwordStrength.score <= 3) return 'text-yellow-600'
    return 'text-green-600'
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

        {/* Signup Card */}
        <Card className="shadow-xl border border-slate-200 bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900">Create Account</CardTitle>
            <CardDescription>
              Get started by creating your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full h-12 text-slate-900 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 font-medium" 
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Chrome className="h-5 w-5 mr-2 text-red-500" />
                )}
                {isGoogleLoading ? 'Connecting to Google...' : 'Sign up with Google'}
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

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-800 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 ${
                        errors.firstName ? 'border-red-400' : 'border-slate-300'
                      }`}
                      placeholder="First Name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-700">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-800 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 ${
                      errors.lastName ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-700">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 ${
                      errors.email ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-700">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 ${
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
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Password strength:</span>
                      <span className={getPasswordStrengthColor()}>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 1 ? 'bg-red-500' :
                          passwordStrength.score <= 2 ? 'bg-orange-500' :
                          passwordStrength.score <= 3 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-sm text-red-700">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 ${
                      errors.confirmPassword ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="Re-enter your password"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 pl-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-700">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-700 focus:ring-blue-700 border-slate-300 rounded mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-800">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-700 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-700 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-700">{errors.agreeToTerms}</p>
                )}

                <div className="flex items-start">
                  <input
                    id="subscribeToNewsletter"
                    name="subscribeToNewsletter"
                    type="checkbox"
                    checked={formData.subscribeToNewsletter}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-700 focus:ring-blue-700 border-slate-300 rounded mt-1"
                  />
                  <label htmlFor="subscribeToNewsletter" className="ml-2 block text-sm text-gray-800">
                    I want to receive the latest news and updates
                  </label>
                </div>
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
                className="w-full h-12 text-lg font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></Loader2>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-slate-700">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
