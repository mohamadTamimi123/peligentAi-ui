'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Store, 
  Save, 
  Edit, 
  Wifi, 
  HelpCircle, 
  ArrowLeft,
  Loader2
} from 'lucide-react'

interface ActivityItem {
  type: string
  message: string
  time: string
  amount: number
}

export default function StorePage() {
  // User data state
  interface UserData { firstName?: string }
  const [userData, setUserData] = useState<UserData | null>(null)

  // Loading and feedback states
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Store form state
  const [storeForm, setStoreForm] = useState({
    siteUrl: '',
    consumerKey: '',
    consumerSecret: '',
    webhookUrl: '',
    siteName: ''
  })

  // Check if form is filled
  const isFormFilled = storeForm.siteUrl && storeForm.consumerKey && storeForm.consumerSecret

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalForm, setOriginalForm] = useState({
    siteUrl: '',
    consumerKey: '',
    consumerSecret: '',
    webhookUrl: '',
    siteName: ''
  })

  useEffect(() => {
    // Check for user authentication
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setUserData(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }

    // Fetch store data
    fetchStoreData()
  }, [])

  const fetchStoreData = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    
    if (!token) {
      setError('No authentication token found')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://127.0.0.1:5008/api/woocommerce/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch store data: ${response.status}`)
      }

      const data = await response.json()
      


      console.log('data', data)

      if(data.success){
        setStoreForm({
          siteUrl: data.data[0].siteUrl || '',
          consumerKey: data.data[0].consumerKey || '',
          consumerSecret: data.data[0].consumerSecret || '',
          webhookUrl: data.data[0].webhookUrl || '',
          siteName: data.data[0].siteName || ''
        })
        setOriginalForm({
          siteUrl: data.data[0].siteUrl || '',
          consumerKey: data.data[0].consumerKey || '',
          consumerSecret: data.data[0].consumerSecret || '',
          webhookUrl: data.data[0].webhookUrl || '',
          siteName: data.data[0].siteName || ''
        })
      }
      
    } catch (error) {
      console.error('Error fetching store data:', error)
      setError(`Failed to fetch store data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
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
          siteUrl: storeForm.siteUrl,
          consumerKey: storeForm.consumerKey,
          consumerSecret: storeForm.consumerSecret,
          webhookUrl: storeForm.webhookUrl,
          siteName: storeForm.siteName
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

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (!token) {
      setMessage('Please login to save changes')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      const response = await fetch('http://127.0.0.1:5008/api/woocommerce/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          siteUrl: storeForm.siteUrl,
          consumerKey: storeForm.consumerKey,
          consumerSecret: storeForm.consumerSecret,
          webhookUrl: storeForm.webhookUrl,
          siteName: storeForm.siteName
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Store information saved successfully!')
        setSuccess('Store information saved successfully!')
        setIsEditMode(false)
        setOriginalForm({...storeForm})
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(null)
          setMessage('')
        }, 3000)
      } else {
        setMessage(data.message || 'Failed to save store information.')
      }
    } catch (error) {
      setMessage('Failed to save store information. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setStoreForm({...originalForm})
    setIsEditMode(false)
    setMessage('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading store information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Store Information</h1>
            <p className="text-sm text-gray-500">Manage your WooCommerce store configuration</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Store Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">Configure your WooCommerce store settings</p>
          </div>
          {!isEditMode ? (
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Form and Help Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Store className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">WooCommerce Settings</h3>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">{message}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Site URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={storeForm.siteUrl}
                  onChange={(e) => setStoreForm({...storeForm, siteUrl: e.target.value})}
                  placeholder="https://your-store.com"
                  className={`w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={!isEditMode || isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Your WooCommerce store URL</p>
              </div>

              {/* Consumer Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumer Key
                </label>
                <input
                  type="text"
                  value={storeForm.consumerKey}
                  onChange={(e) => setStoreForm({...storeForm, consumerKey: e.target.value})}
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className={`w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={!isEditMode || isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Your WooCommerce REST API Consumer Key</p>
              </div>

              {/* Consumer Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumer Secret
                </label>
                <input
                  type="password"
                  value={storeForm.consumerSecret}
                  onChange={(e) => setStoreForm({...storeForm, consumerSecret: e.target.value})}
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className={`w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={!isEditMode || isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Your WooCommerce REST API Consumer Secret</p>
              </div>

              {/* Webhook URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={storeForm.webhookUrl}
                  onChange={(e) => setStoreForm({...storeForm, webhookUrl: e.target.value})}
                  placeholder="https://your-webhook-endpoint.com/webhook"
                  className={`w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={!isEditMode || isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Webhook endpoint for real-time updates</p>
              </div>

              {/* Site Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={storeForm.siteName}
                  onChange={(e) => setStoreForm({...storeForm, siteName: e.target.value})}
                  placeholder="My WooCommerce Store"
                  className={`w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={!isEditMode || isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">Display name for your store</p>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditMode && (
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
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Wifi className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
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
