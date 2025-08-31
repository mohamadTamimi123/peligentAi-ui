'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Send, 
  Bot, 
  RefreshCw, 
  Settings,
  ShoppingBag,
  Users,
  Zap,
  TrendingUp,
  Lightbulb
} from 'lucide-react'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { IntentDetection } from '@/components/chat/IntentDetection'
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary'
import { useChat } from '@/hooks/useChat'

export default function DashboardPage() {
  const router = useRouter()
  const { chatState, clearChat, addMessage } = useChat(100)
  interface DetectedIntent { intent: string; confidence: number; entities: { name: string; value: string }[] }
  const [detectedIntent, setDetectedIntent] = useState<DetectedIntent | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  interface UserData { firstName?: string }
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingResponse, setStreamingResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const showTokenPurchaseModal = () => {
    // Implement token purchase modal
    alert('Insufficient token credits. Please purchase more credits to continue.')
  }

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
      
      // Add welcome message
      addMessage({
        id: Date.now(),
        text: `Welcome back, ${userData.firstName}! I'm your AI assistant. How can I help you today?`,
        sender: 'ai',
        timestamp: new Date(),
        intent: 'welcome'
      })
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/signup')
    }
  }, [router, addMessage])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatState.messages])

  // Update detected intent when chatState.currentIntent changes
  useEffect(() => {
    if (chatState.currentIntent) {
      setDetectedIntent({
        intent: chatState.currentIntent,
        confidence: 0.8,
        entities: []
      })
      handleIntentRouting(chatState.currentIntent)
    }
  }, [chatState.currentIntent])

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token')
    console.log('token', token)
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatState.isLoading) return

    const messageText = inputMessage
    setInputMessage('')
    setIsStreaming(true)
    setStreamingResponse('')

    // Add user message to chat
    addMessage({
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    })

    try {
      const response = await fetch('http://127.0.0.1:5008/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        },
        mode: 'cors',
        body: JSON.stringify({
          message: messageText,
          chatHistory: chatState.messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      })

      // Check for 402 Payment Required
      if (response.status === 402) {
        showTokenPurchaseModal()
        setIsStreaming(false)
        setStreamingResponse('')
        return
      }

      // Handle other errors
      if (!response.ok) {
        let errorMsg = 'An error occurred. Please try again.'
        try {
          const errJson = await response.json()
          if (errJson?.message) errorMsg = errJson.message
        } catch {}
        
        addMessage({
          id: Date.now() + 1,
          text: errorMsg,
          sender: 'ai',
          timestamp: new Date(),
          isError: true
        })
        
        setIsStreaming(false)
        setStreamingResponse('')
        return
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      let fullResponse = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        const chunk = decoder.decode(value)
        fullResponse += chunk
        setStreamingResponse(fullResponse)
      }

      // Add AI response to chat
      addMessage({
        id: Date.now() + 1,
        text: fullResponse,
        sender: 'ai',
        timestamp: new Date()
      })

    } catch (error: unknown) {
      console.error('Chat error:', error)
      const msg = error instanceof Error ? error.message : 'Chat error. Please try again.'
      
      addMessage({
        id: Date.now() + 1,
        text: msg,
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      })
    } finally {
      setIsStreaming(false)
      setStreamingResponse('')
    }
  }

  const handleIntentRouting = (intent: string) => {
    switch (intent) {
      case 'find_product_to_hook':
        console.log('Routing to product search')
        break
      case 'create_discount_ask_more':
        console.log('Routing to discount creation')
        break
      case 'find_best_selling_products':
        console.log('Routing to product analytics')
        break
      default:
        break
    }
  }

  const handleIntentAction = (intent: string, action: string) => {
    console.log(`Intent: ${intent}, Action: ${action}`)
    switch (intent) {
      case 'find_product_to_hook':
        if (action === 'search') {
          console.log('Opening product search')
        }
        break
      case 'create_discount_ask_more':
        if (action === 'create') {
          console.log('Opening discount creation')
        }
        break
      default:
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

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
    <ChatErrorBoundary>
      <div className="flex flex-col h-full">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">AI Chat Assistant</h2>
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI Powered</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={clearChat} className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Intent Detection */}
          <IntentDetection
            currentIntent={detectedIntent}
            onIntentAction={handleIntentAction}
          />
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatState.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))}
            
            {/* Streaming Response */}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-3xl px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 leading-relaxed">
                        {streamingResponse || 'AI is thinking...'}
                      </p>
                      <div className="flex items-center mt-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your business..."
                    className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white shadow-sm transition-all duration-200"
                    disabled={chatState.isLoading || isStreaming}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Lightbulb className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || chatState.isLoading || isStreaming}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send
                </Button>
              </div>
              
              {/* Intent Display */}
              {chatState.currentIntent && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-500">Detected Intent:</span>
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {chatState.currentIntent}
                  </span>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-4 flex items-center justify-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <TrendingUp className="w-4 h-4" />
                  <span>Product Analytics</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Find Products</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Users className="w-4 h-4" />
                  <span>Customer Insights</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatErrorBoundary>
  )
}
