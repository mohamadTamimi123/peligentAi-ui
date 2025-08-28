'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const token = searchParams.get('token')
    const user = searchParams.get('user')

    if (error) {
      setStatus('error')
      setMessage(decodeURIComponent(error))
    } else if (success && token && user) {
      setStatus('success')
      setMessage('Authentication successful! Redirecting to dashboard...')
      
      try {
        // Store user data and token
        const userData = JSON.parse(decodeURIComponent(user))
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        
        // Redirect after countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              if (userData.isEmailVerified) {
                router.push('/dashboard')
              } else {
                router.push('/otp')
              }
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (parseError) {
        console.error('Error parsing user data:', parseError)
        setStatus('error')
        setMessage('Invalid user data received')
      }
    } else {
      setStatus('error')
      setMessage('Invalid authentication response')
    }
  }, [searchParams, router])

  const handleRetry = () => {
    router.push('/signup')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleManualRedirect = () => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.isEmailVerified) {
          router.push('/dashboard')
        } else {
          router.push('/otp')
        }
      } catch {
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-slate-200 bg-white">
          <CardHeader className="text-center pb-6">
            {status === 'loading' && (
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
            
            <CardTitle className="text-2xl text-slate-900">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Authentication Successful!'}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
            
            <CardDescription>
              {status === 'loading' && 'Please wait while we complete your authentication'}
              {status === 'success' && 'You have been successfully authenticated'}
              {status === 'error' && 'There was an issue with your authentication'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Message */}
            <div className={`p-4 rounded-lg text-center ${
              status === 'success' ? 'bg-green-50 text-green-800' :
              status === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>

            {/* Countdown for Success */}
            {status === 'success' && countdown > 0 && (
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {status === 'success' && (
                <Button 
                  onClick={handleManualRedirect}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Go to Dashboard Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              
              {status === 'error' && (
                <>
                  <Button 
                    onClick={handleRetry}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  
                  <Button 
                    onClick={handleGoHome}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                </>
              )}
            </div>

            {/* Additional Info */}
            {status === 'error' && (
              <div className="text-center text-sm text-slate-600">
                <p>If you continue to experience issues, please contact support.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span>Loading...</span></div>}>
      <AuthCallbackInner />
    </Suspense>
  )
}
