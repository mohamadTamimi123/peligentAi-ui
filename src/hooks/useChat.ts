import { useState, useCallback, useRef } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  intent?: string
  isError?: boolean
  isTyping?: boolean
}

interface ChatState {
  messages: Message[]
  currentIntent: string | null
  tokenCredits: number
  isLoading: boolean
}

interface UseChatReturn {
  chatState: ChatState
  sendMessage: (text: string) => Promise<void>
  clearChat: () => void
  addMessage: (message: Message) => void
  updateTokenCredits: (credits: number) => void
  setCurrentIntent: (intent: string | null) => void
}

export function useChat(initialCredits: number = 100): UseChatReturn {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    currentIntent: null,
    tokenCredits: initialCredits,
    isLoading: false
  })

  const chatAPI = useRef(new ChatAPI())

  const addMessage = useCallback((message: Message) => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }))
  }, [])

  const updateTokenCredits = useCallback((credits: number) => {
    setChatState(prev => ({
      ...prev,
      tokenCredits: credits
    }))
  }, [])

  const setCurrentIntent = useCallback((intent: string | null) => {
    setChatState(prev => ({
      ...prev,
      currentIntent: intent
    }))
  }, [])

  const clearChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      currentIntent: null
    }))
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatState.isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }))

    try {
      const response = await chatAPI.current.request('/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          chatHistory: chatState.messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      })

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.response || 'I apologize, but I couldn\'t process your request.',
        sender: 'ai',
        timestamp: new Date(),
        intent: response.intent
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        currentIntent: response.intent || null,
        tokenCredits: response.tokenCredits || prev.tokenCredits,
        isLoading: false
      }))

      return response
    } catch (error: unknown) {
      console.error('Chat error:', error)
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: (error as Error).message || 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      }
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }))

      throw error
    }
  }, [chatState.messages, chatState.isLoading])

  return {
    chatState,
    sendMessage,
    clearChat,
    addMessage,
    updateTokenCredits,
    setCurrentIntent
  }
}

// ChatAPI class (moved from dashboard for reusability)
class ChatAPI {
  private baseURL: string
  private token: string | null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5008/api'
    this.token = localStorage.getItem('authToken') || localStorage.getItem('token')
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: this.getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'API request failed')
    }

    return response.json()
  }
}

export default useChat
