'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Store,
  Globe,
  Package,
  Users,
  DollarSign,
  Settings,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Shield,
  Zap,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Wifi,
  HelpCircle,
  ArrowLeft
} from 'lucide-react'

export default function StorePage() {
  const router = useRouter()
  interface UserData { firstName?: string }
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Store form state
  const [storeForm, setStoreForm] = useState({
    storeUrl: '',
    consumerKey: '',
    consumerSecret: ''
  })

  // Check if form is filled
  const isFormFilled = storeForm.storeUrl && storeForm.consumerKey && storeForm.consumerSecret

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    
    if (!user || !token) {
      router.push('/login')
      return
    }

    try {
      const userData = JSON.parse(user)
      setUserData(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
      return
    }

    // Load existing store data
    fetchStoreData()
  }, [router])

  const fetchStoreData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      
      console.log('token', token)
      console.log('user', user)
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('http://127.0.0.1:5008/api/woocommerce/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        // Don't throw error here, just show empty form
        setIsLoading(false)
        return
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      // Update form with existing data
      if (data.basicInfo) {
        setStoreForm({
          storeUrl: data.basicInfo.url || '',
          consumerKey: data.basicInfo.consumerKey || '',
          consumerSecret: data.basicInfo.consumerSecret || '',
        })
      }
    } catch (error) {
      console.error('Error fetching store data:', error)
      // Don't show error, just show empty form
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('Saving with token:', token)

      const response = await fetch('http://127.0.0.1:5008/api/woocommerce/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          basicInfo: {
            url: storeForm.storeUrl,
            consumerKey: storeForm.consumerKey,
            consumerSecret: storeForm.consumerSecret,
          }
        })
      })

      console.log('Save response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Save API Error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedData = await response.json()
      console.log('Save API Response:', updatedData)
      setSuccess('Store information saved successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error updating store data:', error)
      setError('Failed to save store information. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestConnection = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('http://127.0.0.1:5008/api/woocommerce/test-connection', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          storeUrl: storeForm.storeUrl,
          consumerKey: storeForm.consumerKey,
          consumerSecret: storeForm.consumerSecret
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Connection failed: ${errorText}`)
      }

      const result = await response.json()
      setSuccess('Connection successful! Store is properly configured.')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error testing connection:', error)
      setError(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading store configuration...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Store Information</h1>
                <p className="text-sm text-gray-500">Configure your WooCommerce store</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchStoreData}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-xs text-green-600 hover:text-green-800 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            WooCommerce Store Configuration
          </h2>
          <p className="text-gray-500">Connect your WooCommerce store to enable AI-powered features</p>
        </div>

        {/* Form and Help Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Store className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Store Connection</h3>
            </div>

            <div className="space-y-6">
              {/* Store URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store URL *
                </label>
                <input
                  type="url"
                  value={storeForm.storeUrl}
                  onChange={(e) => setStoreForm({...storeForm, storeUrl: e.target.value})}
                  placeholder="https://your-store.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Enter your WooCommerce store URL (e.g., https://mysite.com)</p>
              </div>

              {/* Consumer Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumer Key *
                </label>
                <input
                  type="text"
                  value={storeForm.consumerKey}
                  onChange={(e) => setStoreForm({...storeForm, consumerKey: e.target.value})}
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Your WooCommerce REST API Consumer Key</p>
              </div>

              {/* Consumer Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumer Secret *
                </label>
                <input
                  type="password"
                  value={storeForm.consumerSecret}
                  onChange={(e) => setStoreForm({...storeForm, consumerSecret: e.target.value})}
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Your WooCommerce REST API Consumer Secret</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
              <div className="text-sm text-gray-500">
                * Required fields
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTestConnection}
                  disabled={!isFormFilled || isSaving}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={!isFormFilled || isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 h-fit">
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">How to get your API credentials?</h3>
            </div>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">1</span>
                <p>Go to your WooCommerce admin panel</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">2</span>
                <p>Navigate to <strong>WooCommerce → Settings → Advanced → REST API</strong></p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">3</span>
                <p>Click <strong>"Add Key"</strong> to create a new API key</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">4</span>
                <p>Set permissions to <strong>"Read/Write"</strong></p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">5</span>
                <p>Copy the <strong>Consumer Key</strong> and <strong>Consumer Secret</strong></p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">6</span>
                <p>Paste them in the form above</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
