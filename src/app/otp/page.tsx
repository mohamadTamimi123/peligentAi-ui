'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, ArrowLeft, Clock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export default function OTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get user email from localStorage
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setUserEmail(userData.email || '')
      } catch (error) {
        console.error('Error parsing user data:', error)
        router.push('/signup')
      }
    } else {
      router.push('/signup')
    }
  }, [router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }))
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newOtp = [...otp]
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || ''
      }
      setOtp(newOtp)
      
      // Focus last filled input
      const lastFilledIndex = Math.min(pastedData.length - 1, 5)
      inputRefs.current[lastFilledIndex]?.focus()
    }
  }

  const validateOtp = () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' })
      return false
    }
    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ otp: 'Please enter only numbers' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateOtp()) {
      return
    }

    setIsLoading(true)
    setVerificationStatus('idle')
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const url = `${baseUrl}/api/auth/verify-otp`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          otpCode: otp.join('')
        }),
        mode: 'cors',
      })

      if (!response.ok) {
        let message = 'OTP verification failed. Please try again.'
        try {
          const errJson = await response.json()
          if (errJson?.message) message = errJson.message
          if (errJson?.error) message = errJson.error
        } catch {}
        throw new Error(message)
      }

      const data = await response.json()
      console.log('OTP verification success:', data)

      if (response.ok && data.success) {
        setVerificationStatus('success')
        

        console.log('data', data)
        // Update user verification status in localStorage
        const user = localStorage.getItem('user')
        if (user) {
          const userData = JSON.parse(user)
          userData.isEmailVerified = true
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('token', data.tokens.accessToken)
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }

    } catch (error: unknown) {
      console.error('OTP verification error:', error)
      const message = error instanceof Error ? error.message : 'OTP verification error. Please try again.'
      setErrors({ general: message })
      setVerificationStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return
    
    setIsResending(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const url = `${baseUrl}/api/auth/resend-otp`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
        mode: 'cors',
      })

      if (!response.ok) {
        let message = 'Failed to resend OTP. Please try again.'
        try {
          const errJson = await response.json()
          if (errJson?.message) message = errJson.message
        } catch {}
        throw new Error(message)
      }

      // Reset countdown and disable resend
      setCountdown(60)
      setCanResend(false)
      setErrors({})
      
      // Clear OTP fields
      setOtp(['', '', '', '', '', ''])
      
      // Focus first input
      inputRefs.current[0]?.focus()

    } catch (error: unknown) {
      console.error('Resend OTP error:', error)
      const message = error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.'
      setErrors({ resend: message })
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
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

        {/* OTP Card */}
        <Card className="shadow-xl border border-slate-200 bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900">Verify Your Email</CardTitle>
            <CardDescription className="text-slate-600">
              We&apos;ve sent a 6-digit verification code to
            </CardDescription>
            <div className="mt-2">
              <span className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                {userEmail}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success Message */}
            {verificationStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-700 font-medium">
                    Email verified successfully! Redirecting to dashboard...
                  </p>
                </div>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-4 text-center">
                  Enter the 6-digit code
                </label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 text-center text-lg font-semibold text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.otp ? 'border-red-400' : 'border-slate-300'
                      } ${digit ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                      placeholder="•"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || verificationStatus === 'success'}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </Button>
            </form>

            {/* Resend Section */}
            <div className="text-center space-y-3">
              <div className="text-sm text-slate-600">
                Didn&apos;t receive the code?
              </div>
              
              {canResend ? (
                <Button
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  {isResending ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend Code
                    </div>
                  )}
                </Button>
              ) : (
                <div className="flex items-center justify-center text-sm text-slate-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Resend available in {formatTime(countdown)}
                </div>
              )}
            </div>

            {/* Resend Error */}
            {errors.resend && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700 text-center">{errors.resend}</p>
              </div>
            )}

            {/* Help Section */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-slate-600 mb-2">
                Having trouble? Check your spam folder or
              </p>
              <Link 
                href="/contact" 
                className="text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">
            By verifying your email, you agree to our{' '}
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
