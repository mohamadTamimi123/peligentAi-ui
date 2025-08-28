'use client'

import { Bot, User, Clock, AlertCircle } from 'lucide-react'

interface ChatMessageProps {
  message: {
    id: number
    text: string
    sender: 'user' | 'ai'
    timestamp: Date
    intent?: string
    isError?: boolean
    isTyping?: boolean
  }
  className?: string
}

export function ChatMessage({ message, className = '' }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getIntentColor = (intent: string) => {
    const intentColors: { [key: string]: string } = {
      'find_product_to_hook': 'bg-blue-100 text-blue-700 border-blue-200',
      'create_discount_ask_more': 'bg-green-100 text-green-700 border-green-200',
      'find_best_selling_products': 'bg-purple-100 text-purple-700 border-purple-200',
      'general_inquiry': 'bg-gray-100 text-gray-700 border-gray-200',
      'welcome': 'bg-blue-100 text-blue-700 border-blue-200'
    }
    return intentColors[intent] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const isUser = message.sender === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : message.isError
            ? 'bg-red-50 text-red-900 border border-red-200'
            : 'bg-slate-100 text-slate-900'
        }`}
      >
        <div className="flex items-start space-x-2">
          {!isUser && (
            <div className="flex-shrink-0">
              {message.isError ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : message.isTyping ? (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              ) : (
                <Bot className="w-5 h-5 text-blue-600" />
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-relaxed ${
              message.isError ? 'text-red-800' : ''
            }`}>
              {message.text}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 opacity-70" />
                <span className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              {message.intent && !isUser && (
                <span className={`text-xs px-2 py-1 rounded-full border ${getIntentColor(message.intent)}`}>
                  {message.intent.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
              
              {message.isError && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
                  Error
                </span>
              )}
              
              {message.isTyping && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                  Typing...
                </span>
              )}
            </div>
          </div>
          
          {isUser && (
            <div className="flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
