'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [message, setMessage] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  })

  // Check if we have a reset token in URL
  const resetToken = searchParams.get('token')

  // Auto-detect token and set step to reset if token is present
  useEffect(() => {
    if (resetToken) {
      setStep('reset')
    }
  }, [resetToken])

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

  const validateRequestForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateResetForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateRequestForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${baseUrl}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage(data.message)
        setStep('success')
      } else {
        setErrors({ general: data.error || 'Failed to send reset email' })
      }
    } catch (error) {
      console.error('Request reset error:', error)
      setErrors({ general: 'Failed to send reset email. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateResetForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: resetToken,
          newPassword 
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage(data.message)
        setStep('success')
      } else {
        setErrors({ general: data.error || 'Failed to reset password' })
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setErrors({ general: 'Failed to reset password. Please try again.' })
    } finally {
      setIsLoading(false)
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

        {/* Main Card */}
        <Card className="shadow-xl border border-slate-200 bg-white">
          <CardHeader className="text-center pb-6">
            {step === 'success' ? (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            )}
            
            <CardTitle className="text-2xl text-slate-900">
              {step === 'request' && 'Reset Password'}
              {step === 'reset' && 'Set New Password'}
              {step === 'success' && 'Success!'}
            </CardTitle>
            
            <CardDescription>
              {step === 'request' && 'Enter your email to receive a password reset link'}
              {step === 'reset' && 'Enter your new password'}
              {step === 'success' && 'Your password has been reset successfully'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success Message */}
            {step === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-center">{message}</p>
                <div className="mt-4 flex space-x-3">
                  <Button 
                    onClick={() => router.push('/login')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Go to Login
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="flex-1 text-slate-900"
                  >
                    Go Home
                  </Button>
                </div>
              </div>
            )}

            {/* Request Reset Form */}
            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-400' : 'border-slate-300'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-700">{errors.email}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></Loader2>
                      Sending Reset Link...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            )}

            {/* Reset Password Form */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        checkPasswordStrength(e.target.value)
                      }}
                      className={`w-full pl-10 pr-10 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.newPassword ? 'border-red-400' : 'border-slate-300'
                      }`}
                      placeholder="Enter new password"
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
                  {newPassword && (
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
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-700">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2 text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.confirmPassword ? 'border-red-400' : 'border-slate-300'
                      }`}
                      placeholder="Confirm new password"
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

                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></Loader2>
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}

            {/* Additional Links */}
            {step !== 'success' && (
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-slate-700">
                  Remember your password?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span>Loading...</span></div>}>
      <ResetPasswordInner />
    </Suspense>
  )
}
