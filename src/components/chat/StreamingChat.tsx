'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, AlertCircle, CheckCircle } from 'lucide-react'

interface StreamingMessage {
  id: number
  content: string
  isComplete: boolean
  timestamp: Date
}

interface StreamingChatProps {
  onMessageComplete: (message: StreamingMessage) => void
  onError: (error: string) => void
  className?: string
}

export function StreamingChat({ onMessageComplete, onError, className = '' }: StreamingChatProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  interface ChatHistoryItem { role: 'user' | 'assistant'; content: string }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startStreaming = async (message: string, chatHistory: ChatHistoryItem[] = []) => {
    if (isStreaming) return

    setIsStreaming(true)
    setStreamingContent('')
    setError(null)
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const baseUrl = 'http://127.0.0.1:5008/api'
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chatHistory
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body reader available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.content) {
                setStreamingContent(prev => prev + data.content)
              }
              
              if (data.error) {
                throw new Error(data.error)
              }
              
              if (data.done) {
                // Stream completed
                const completeMessage: StreamingMessage = {
                  id: Date.now(),
                  content: streamingContent + (data.content || ''),
                  isComplete: true,
                  timestamp: new Date()
                }
                
                onMessageComplete(completeMessage)
                setIsStreaming(false)
                return
              }
            } catch {
              // Skip invalid JSON lines
              console.warn('Failed to parse streaming data:', line)
            }
          }
        }
      }

      // If we reach here, the stream completed normally
      const completeMessage: StreamingMessage = {
        id: Date.now(),
        content: streamingContent,
        isComplete: true,
        timestamp: new Date()
      }
      
      onMessageComplete(completeMessage)

    } catch (error: unknown) {
      const err = error as { name?: string; message?: string }
      if (err?.name === 'AbortError') {
        // Request was cancelled
        return
      }
      const errorMessage = err?.message || 'Streaming failed'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsStreaming(false)
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className={`streaming-chat ${className}`}>
      {/* Streaming Status */}
      {isStreaming && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-blue-700 font-medium">AI is responding...</span>
          <button
            onClick={stopStreaming}
            className="ml-auto text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Stop
          </button>
        </div>
      )}

      {/* Streaming Content Display */}
      {streamingContent && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Bot className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {streamingContent}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  {isStreaming ? 'Streaming...' : 'Complete'}
                </span>
                {!isStreaming && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Streaming Controls */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {isStreaming ? 'Streaming in progress...' : 'Ready for streaming'}
        </span>
        {isStreaming && (
          <button
            onClick={stopStreaming}
            className="text-red-600 hover:text-red-800 underline"
          >
            Stop Streaming
          </button>
        )}
      </div>
    </div>
  )
}

export default StreamingChat
