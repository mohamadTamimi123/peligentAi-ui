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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI Powered</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTokenSection(!showTokenSection)}
            className="rounded-xl"
          >
            <Key className="w-4 h-4 mr-2" />
            API Token
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Token Section */}
      {showTokenSection && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">API Token for WordPress</h3>
                    <p className="text-sm text-gray-600">Use this token to connect your WordPress site</p>
                  </div>
                </div>
                <Button
                  onClick={copyToken}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Token</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm text-gray-700 font-mono break-all">
                    {getToken()}
                  </code>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">WordPress Plugin Setup</p>
                    <p className="text-sm text-gray-600">Install the PELIGENT plugin and enter this token in the settings</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">API Endpoint</p>
                    <p className="text-sm text-gray-600">Your WordPress site will connect to: <code className="bg-gray-100 px-1 rounded">http://127.0.0.1:5008/api</code></p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secure Connection</p>
                    <p className="text-sm text-gray-600">All communication is encrypted and authenticated</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">Need help setting up?</span>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userData.firstName}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your WooCommerce store today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Token Credits</CardTitle>
                <Zap className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <div className="px-6 pb-4">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.tokenCredits.toLocaleString()}</div>
                <p className="text-xs text-gray-600">Available for AI operations</p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <div className="px-6 pb-4">
                <div className="text-2xl font-bold text-green-600">{dashboardData.stats.totalProducts}</div>
                <p className="text-xs text-gray-600">In your store</p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <div className="px-6 pb-4">
                <div className="text-2xl font-bold text-purple-600">{dashboardData.stats.totalOrders}</div>
                <p className="text-xs text-gray-600">Processed</p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <div className="px-6 pb-4">
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(dashboardData.stats.totalRevenue)}</div>
                <p className="text-xs text-gray-600">Generated</p>
              </div>
            </Card>
          </div>

          {/* Store Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="w-5 h-5 text-blue-600" />
                  <span>Store Information</span>
                </CardTitle>
                <CardDescription>Your WooCommerce store details</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Store Name:</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardData.storeInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Store URL:</span>
                    <span className="text-sm font-medium text-blue-600">{dashboardData.storeInfo.url}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Products:</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardData.storeInfo.products}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customers:</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardData.storeInfo.customers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Revenue:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(dashboardData.storeInfo.revenue)}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span>AI Performance</span>
                </CardTitle>
                <CardDescription>AI optimization metrics</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Optimizations:</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardData.stats.aiOptimizations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SEO Score:</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardData.stats.seoScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Products Optimized:</span>
                    <span className="text-sm font-medium text-gray-900">45/156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Optimization:</span>
                    <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                  </div>
                  <div className="pt-2">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Run AI Optimization
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest updates from your store</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
          </Card>
        </div>
      </div>
    </div>
  )
}
