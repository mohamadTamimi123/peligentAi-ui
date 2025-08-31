'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare,
  BarChart3,
  ShoppingBag,
  Users,
  CreditCard,
  HelpCircle,
  Sparkles,
  LogOut,
  Store
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface UserData {
  firstName?: string
  lastName?: string
  email?: string
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('chat')

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    

    console.log('token from dashboard layout', token)

    if (!user || !token) {
      router.push('/login')
      return
    }

    try {
      const userData = JSON.parse(user)
      setUserData(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/signup')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    router.push('/login')
  }

  const handleNavigation = (itemId: string) => {
    setSelectedSidebarItem(itemId)
    if (itemId === 'store') {
      router.push('/dashboard/store')
    } else if (itemId === 'chat') {
      router.push('/dashboard')
    }
    // Add other navigation logic as needed
  }

  const sidebarItems = [
    { id: 'chat', icon: MessageSquare, label: 'Dashboard', color: 'text-blue-600' },
    { id: 'store', icon: Store, label: 'Store Information', color: 'text-indigo-600' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'text-green-600' },
    { id: 'products', icon: ShoppingBag, label: 'Products', color: 'text-purple-600' },
    { id: 'customers', icon: Users, label: 'Customers', color: 'text-orange-600' },
    { id: 'billing', icon: CreditCard, label: 'Billing', color: 'text-red-600' },
    { id: 'help', icon: HelpCircle, label: 'Help', color: 'text-gray-600' },
  ]

  if (!userData) {
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
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Peligent</h1>
              <p className="text-sm text-gray-500">AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  selectedSidebarItem === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {userData.firstName?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{userData.firstName || 'User'}</p>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
