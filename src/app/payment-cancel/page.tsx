'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { XCircle, ArrowLeft, RefreshCw, Home, CreditCard, AlertTriangle } from 'lucide-react'

interface CancelData {
  transactionId?: string
  reason?: string
  amount?: number
  planName?: string
  timestamp?: string
}

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cancelData, setCancelData] = useState<CancelData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchCancelDetails = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken')
        if (!token) {
          router.push('/login')
          return
        }

        // Get cancellation details from URL params
        const transactionId = searchParams.get('transaction_id') || searchParams.get('id')
        const reason = searchParams.get('reason') || searchParams.get('error')
        const status = searchParams.get('status')
        
        if (transactionId) {
          // Try to fetch cancellation details from backend
          try {
            const response = await fetch(`http://127.0.0.1:5008/api/billing/payment-status/${transactionId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })

            if (response.ok) {
              const data = await response.json()
              setCancelData({
                transactionId: data.transactionId || transactionId,
                reason: data.reason || reason || 'Payment was cancelled',
                amount: data.amount,
                planName: data.planName,
                timestamp: data.timestamp || new Date().toISOString()
              })
            } else {
              // Fallback to URL params
              setCancelData({
                transactionId,
                reason: reason || 'Payment was cancelled',
                timestamp: new Date().toISOString()
              })
            }
          } catch (err) {
            // Fallback to URL params
            setCancelData({
              transactionId,
              reason: reason || 'Payment was cancelled',
              timestamp: new Date().toISOString()
            })
          }
        } else {
          // No transaction ID, show generic cancellation
          setCancelData({
            reason: reason || 'Payment was cancelled',
            timestamp: new Date().toISOString()
          })
        }
      } catch (err) {
        console.error('Error fetching cancellation details:', err)
        setError('Failed to load cancellation details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCancelDetails()
  }, [router, searchParams])

  const handleRetryPayment = () => {
    router.push('/dashboard/billing')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading cancellation details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Details</h1>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">Payment Cancelled</h1>
              <div className="px-2 py-1 bg-orange-50 rounded-md">
                <span className="text-xs font-medium text-orange-600">Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Cancellation Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
            <p className="text-gray-600 text-lg">
              Your payment was not completed. No charges were made to your account.
            </p>
          </div>

          {/* Cancellation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Transaction Details</h3>
                  <p className="text-sm text-gray-500">Cancellation information</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {cancelData.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm text-gray-900">{cancelData.transactionId}</span>
                  </div>
                )}
                {cancelData.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">${cancelData.amount} USD</span>
                  </div>
                )}
                {cancelData.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">
                      {new Date(cancelData.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Cancelled
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cancellation Reason</h3>
                  <p className="text-sm text-gray-500">Why the payment was cancelled</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <p className="text-sm text-orange-800">
                    {cancelData.reason || 'Payment was cancelled by user or due to technical issues'}
                  </p>
                </div>
                {cancelData.planName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-gray-900">{cancelData.planName}</span>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-4">
                  <p>• No charges were made to your account</p>
                  <p>• Your payment method was not charged</p>
                  <p>• You can try again anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full border-gray-200 hover:border-gray-300 rounded-xl py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="w-full border-gray-200 hover:border-gray-300 rounded-xl py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Common Reasons for Cancellation:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Insufficient funds in your account</li>
                <li>• Payment method was declined</li>
                <li>• Browser or network issues</li>
                <li>• Payment gateway timeout</li>
                <li>• User cancelled the payment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What You Can Do:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Check your payment method details</li>
                <li>• Ensure sufficient funds are available</li>
                <li>• Try a different payment method</li>
                <li>• Contact your bank if needed</li>
                <li>• Try again in a few minutes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mt-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Still Having Issues?</h3>
            <p className="text-gray-600 mb-4">
              If you continue to experience problems, our support team is here to help.
            </p>
            <Button
              onClick={() => router.push('/contact')}
              variant="outline"
              className="border-blue-300 hover:border-blue-400 text-blue-700"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
