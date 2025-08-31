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
  AlertCircle
} from 'lucide-react'

export default function StorePage() {
  const router = useRouter()
  interface UserData { firstName?: string }
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Store data state
  const [storeData, setStoreData] = useState({
    basicInfo: {
      name: '',
      url: '',
      description: '',
      currency: 'USD',
      timezone: 'UTC-5',
      language: 'English'
    },
    statistics: {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      conversionRate: 0
    },
    settings: {
      storeStatus: 'active',
      maintenanceMode: false,
      autoBackup: true,
      sslEnabled: true,
      seoOptimized: true
    },
    recentActivity: [],
    quickStats: {
      todayOrders: 0,
      todayRevenue: 0,
      thisWeekOrders: 0,
      thisWeekRevenue: 0,
      thisMonthOrders: 0,
      thisMonthRevenue: 0
    }
  })

  const [editForm, setEditForm] = useState(storeData.basicInfo)

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
      
      // Fetch store data from API
      fetchStoreData()
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/signup')
    }
  }, [router])

  const fetchStoreData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      const response = await fetch('http://127.0.0.1:5008/api/store', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStoreData(data)
      setEditForm(data.basicInfo)
    } catch (error) {
      console.error('Error fetching store data:', error)
      setError('Failed to load store information. Please try again.')
      
      // Fallback to mock data if API fails
      setStoreData({
        basicInfo: {
          name: 'My WooCommerce Store',
          url: 'https://my-store.com',
          description: 'Premium electronics and gadgets store',
          currency: 'USD',
          timezone: 'UTC-5',
          language: 'English'
        },
        statistics: {
          totalProducts: 156,
          totalOrders: 89,
          totalCustomers: 234,
          totalRevenue: 15420,
          averageOrderValue: 173,
          conversionRate: 3.2
        },
        settings: {
          storeStatus: 'active',
          maintenanceMode: false,
          autoBackup: true,
          sslEnabled: true,
          seoOptimized: true
        },
        recentActivity: [
          { type: 'order', message: 'New order #1234 received', time: '2 hours ago', amount: 299 },
          { type: 'product', message: 'Product "Wireless Headphones" updated', time: '4 hours ago' },
          { type: 'customer', message: 'New customer registered', time: '6 hours ago' },
          { type: 'revenue', message: 'Daily revenue target achieved', time: '1 day ago', amount: 1200 }
        ],
        quickStats: {
          todayOrders: 12,
          todayRevenue: 2400,
          thisWeekOrders: 67,
          thisWeekRevenue: 8900,
          thisMonthOrders: 234,
          thisMonthRevenue: 15420
        }
      })
      setEditForm({
        name: 'My WooCommerce Store',
        url: 'https://my-store.com',
        description: 'Premium electronics and gadgets store',
        currency: 'USD',
        timezone: 'UTC-5',
        language: 'English'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      const response = await fetch('http://127.0.0.1:5008/api/store', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basicInfo: editForm
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedData = await response.json()
      setStoreData(prev => ({
        ...prev,
        basicInfo: updatedData.basicInfo
      }))
      setIsEditing(false)
      
      // Show success message
      alert('Store information updated successfully!')
    } catch (error) {
      console.error('Error updating store data:', error)
      setError('Failed to update store information. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm(storeData.basicInfo)
    setIsEditing(false)
    setError(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (!userData || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading store information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">Store Information</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchStoreData}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Store
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSaving}
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
                        Save
                      </>
                    )}
                  </Button>
                </>
              )}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Store Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Store Overview
          </h2>
          <p className="text-gray-500">Manage your WooCommerce store settings and view performance metrics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Today</span>
              <Calendar className="w-3 h-3 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{storeData.quickStats.todayOrders}</div>
            <p className="text-xs text-gray-500">Orders</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Today</span>
              <DollarSign className="w-3 h-3 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(storeData.quickStats.todayRevenue)}</div>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">This Week</span>
              <TrendingUp className="w-3 h-3 text-purple-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{storeData.quickStats.thisWeekOrders}</div>
            <p className="text-xs text-gray-500">Orders</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">This Week</span>
              <DollarSign className="w-3 h-3 text-orange-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(storeData.quickStats.thisWeekRevenue)}</div>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">This Month</span>
              <ShoppingCart className="w-3 h-3 text-indigo-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{storeData.quickStats.thisMonthOrders}</div>
            <p className="text-xs text-gray-500">Orders</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">This Month</span>
              <CreditCard className="w-3 h-3 text-red-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(storeData.quickStats.thisMonthRevenue)}</div>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
        </div>

        {/* Store Information & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Store className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            {!isEditing ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Store Name</span>
                  <span className="text-sm font-medium text-gray-900">{storeData.basicInfo.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Store URL</span>
                  <span className="text-sm font-medium text-blue-600">{storeData.basicInfo.url}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Description</span>
                  <span className="text-sm font-medium text-gray-900">{storeData.basicInfo.description}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Currency</span>
                  <span className="text-sm font-medium text-gray-900">{storeData.basicInfo.currency}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Timezone</span>
                  <span className="text-sm font-medium text-gray-900">{storeData.basicInfo.timezone}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Language</span>
                  <span className="text-sm font-medium text-gray-900">{storeData.basicInfo.language}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Store Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Store URL</label>
                  <input
                    type="url"
                    value={editForm.url}
                    onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={editForm.currency}
                      onChange={(e) => setEditForm({...editForm, currency: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSaving}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <select
                      value={editForm.language}
                      onChange={(e) => setEditForm({...editForm, language: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSaving}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Store Settings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Store Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Store Status</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  storeData.settings.storeStatus === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {storeData.settings.storeStatus}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Maintenance Mode</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  storeData.settings.maintenanceMode 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {storeData.settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Auto Backup</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  storeData.settings.autoBackup 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {storeData.settings.autoBackup ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">SSL Certificate</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  storeData.settings.sslEnabled 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {storeData.settings.sslEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">SEO Optimization</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  storeData.settings.seoOptimized 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {storeData.settings.seoOptimized ? 'Optimized' : 'Not Optimized'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Statistics */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Store Statistics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{storeData.statistics.totalProducts}</div>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{storeData.statistics.totalOrders}</div>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{storeData.statistics.totalCustomers}</div>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{formatCurrency(storeData.statistics.totalRevenue)}</div>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(storeData.statistics.averageOrderValue)}</div>
              <p className="text-sm text-gray-600">Average Order Value</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{storeData.statistics.conversionRate}%</div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">87%</div>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {storeData.recentActivity.length > 0 ? (
              storeData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'order' ? 'bg-green-100' :
                    activity.type === 'product' ? 'bg-blue-100' :
                    activity.type === 'customer' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-green-600" />}
                    {activity.type === 'product' && <Package className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'customer' && <Users className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'revenue' && <DollarSign className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(activity.amount)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
