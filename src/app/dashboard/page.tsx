'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  RefreshCw, 
  Settings,
  ShoppingBag,
  Users,
  Zap,
  TrendingUp,
  Lightbulb,
  Copy,
  Check,
  Key,
  ExternalLink,
  Store,
  CreditCard,
  Package,
  BarChart3,
  Calendar,
  DollarSign,
  Activity,
  Globe
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  interface UserData { firstName?: string }
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showTokenSection, setShowTokenSection] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with real API calls
  const [dashboardData, setDashboardData] = useState({
    tokenCredits: 1250,
    storeInfo: {
      name: 'My WooCommerce Store',
      url: 'https://my-store.com',
      products: 156,
      orders: 89,
      customers: 234,
      revenue: 15420
    },
    recentActivity: [
      { type: 'order', message: 'New order #1234 received', time: '2 hours ago' },
      { type: 'product', message: 'Product "Wireless Headphones" updated', time: '4 hours ago' },
      { type: 'customer', message: 'New customer registered', time: '6 hours ago' },
      { type: 'ai', message: 'AI optimized 15 product descriptions', time: '1 day ago' }
    ],
    stats: {
      totalProducts: 156,
      totalOrders: 89,
      totalCustomers: 234,
      totalRevenue: 15420,
      aiOptimizations: 45,
      seoScore: 87
    }
  })

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
      
      // Fetch remaining token credits from backend
      const fetchTokenCredits = async () => {
        try {
          const authToken = localStorage.getItem('token') || localStorage.getItem('authToken')
          if (!authToken) return
          const response = await fetch('http://127.0.0.1:5008/api/chat/tokens', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          })
          if (response.ok) {
            const data = await response.json()
            const credits = data?.remainingTokens ?? data?.tokenCredits ?? data?.credits ?? data?.tokensRemaining ?? 0
            setDashboardData(prev => ({ ...prev, tokenCredits: Number(credits) || 0 }))
          }
        } catch (err) {
          console.error('Failed to fetch token credits:', err)
        }
      }
      fetchTokenCredits()
      
      // Simulate loading dashboard data
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/signup')
    }
  }, [router])

  const copyToken = async () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token')
    if (token) {
      try {
        await navigator.clipboard.writeText(token)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy token:', err)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = token
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const getToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token') || 'No token found'
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
          <p className="text-gray-500 text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <div className="px-2 py-1 bg-blue-50 rounded-md">
                <span className="text-xs font-medium text-blue-600">AI Powered</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTokenSection(!showTokenSection)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Key className="w-4 h-4 mr-2" />
                API Token
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Section */}
      {showTokenSection && (
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Key className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">API Token</h3>
                    <p className="text-sm text-gray-500">Connect your WordPress site</p>
                  </div>
                </div>
                <Button
                  onClick={copyToken}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <code className="text-sm text-gray-700 font-mono break-all">
                  {getToken()}
                </code>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">WordPress Plugin Setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">API: http://127.0.0.1:5008/api</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Secure Connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome back, {userData.firstName}
          </h2>
          <p className="text-gray-500">Here's your store overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Remaining Tokens</span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{dashboardData.tokenCredits.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Available</p>
            <div className="mt-3">
              <Button
                onClick={() => {
                  window.location.href = '/dashboard/billing'
                }}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Buy Tokens
              </Button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Products</span>
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{dashboardData.stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">In store</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Orders</span>
              <ShoppingBag className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{dashboardData.stats.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Processed</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Revenue</span>
              <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(dashboardData.stats.totalRevenue)}</div>
            <p className="text-xs text-gray-500 mt-1">Generated</p>
          </div>
        </div>

        {/* Store & AI Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Store className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Store Name</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData.storeInfo.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Store URL</span>
                <span className="text-sm font-medium text-blue-600">{dashboardData.storeInfo.url}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Products</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData.storeInfo.products}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Customers</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData.storeInfo.customers}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(dashboardData.storeInfo.revenue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">AI Optimizations</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData.stats.aiOptimizations}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">SEO Score</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData.stats.seoScore}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Products Optimized</span>
                <span className="text-sm font-medium text-gray-900">45/156</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Last Optimization</span>
                <span className="text-sm font-medium text-gray-900">2 hours ago</span>
              </div>
            </div>
            <Button size="sm" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Zap className="w-4 h-4 mr-2" />
              Run AI Optimization
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-green-100' :
                  activity.type === 'product' ? 'bg-blue-100' :
                  activity.type === 'customer' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'order' && <ShoppingBag className="w-4 h-4 text-green-600" />}
                  {activity.type === 'product' && <Package className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'customer' && <Users className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'ai' && <Zap className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
