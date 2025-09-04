'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ArrowRight, CreditCard, Zap, Home, RefreshCw } from 'lucide-react'

interface PaymentData {
  transactionId?: string
  amount?: number
  tokens?: number
  planName?: string
  status?: string
  timestamp?: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken')
        if (!token) {
          router.push('/login')
          return
        }

        // Get payment details from URL params or fetch from API
        const transactionId = searchParams.get('session_id') || searchParams.get('session_id')
        const status = searchParams.get('status')
        
        if (transactionId) {
          // Fetch payment details from backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/payment-status/${transactionId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const data = await response.json()
            setPaymentData({
              transactionId: data.transactionId || transactionId,
              amount: data.amount,
              tokens: data.tokens,
              planName: data.planName,
              status: data.status || status,
              timestamp: data.timestamp || new Date().toISOString()
            })
          } else {
            // Fallback to URL params
            setPaymentData({
              transactionId,
              status,
              timestamp: new Date().toISOString()
            })
          }
        } else {
          // No transaction ID, show generic success
          setPaymentData({
            status: 'success',
            timestamp: new Date().toISOString()
          })
        }
      } catch (err) {
        console.error('Error fetching payment details:', err)
        setError('Failed to load payment details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentDetails()
  }, [router, searchParams])

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleBuyMore = () => {
    router.push('/dashboard/billing')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Status Unclear</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={handleRefresh}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-green-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">Payment Success</h1>
              <div className="px-2 py-1 bg-green-50 rounded-md">
                <span className="text-xs font-medium text-green-600">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-lg">
              Your payment has been processed successfully. Your tokens are now available in your account.
            </p>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Details</h3>
                  <p className="text-sm text-gray-500">Transaction information</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {paymentData.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm text-gray-900">{paymentData.transactionId}</span>
                  </div>
                )}
                {paymentData.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">${paymentData.amount} USD</span>
                  </div>
                )}
                {paymentData.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">
                      {new Date(paymentData.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Token Details</h3>
                  <p className="text-sm text-gray-500">Your purchase summary</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {paymentData.planName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-gray-900">{paymentData.planName}</span>
                  </div>
                )}
                {paymentData.tokens && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tokens Added:</span>
                    <span className="font-semibold text-gray-900">{paymentData.tokens.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              onClick={handleBuyMore}
              variant="outline"
              className="w-full border-gray-200 hover:border-gray-300 rounded-xl py-3"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Buy More Tokens
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">What&apos;s Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Start Using Tokens</h4>
                <p className="text-gray-600">Your tokens are now available for use in the chat interface.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Check Usage</h4>
                <p className="text-gray-600">Monitor your token usage in the dashboard billing section.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Get Support</h4>
                <p className="text-gray-600">Contact support if you have any questions about your purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
