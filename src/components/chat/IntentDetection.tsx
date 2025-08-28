'use client'

import { useState, useEffect } from 'react'
import { Search, Tag, TrendingUp, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface Intent {
  intent: string
  confidence: number
  entities?: { name: string; value: string }[]
  description?: string
}

interface IntentDetectionProps {
  currentIntent: Intent | null
  onIntentAction: (intent: string, action: string) => void
  className?: string
}

const INTENT_ACTIONS = {
  find_product_to_hook: {
    title: 'Product Search',
    description: 'Find products to create compelling hooks',
    icon: Search,
    actions: [
      { label: 'Search Products', action: 'search', color: 'blue' },
      { label: 'View Categories', action: 'categories', color: 'green' },
      { label: 'Filter by Price', action: 'price_filter', color: 'purple' }
    ]
  },
  create_discount_ask_more: {
    title: 'Discount Creation',
    description: 'Create and manage discount campaigns',
    icon: Tag,
    actions: [
      { label: 'Create Discount', action: 'create', color: 'green' },
      { label: 'View Existing', action: 'view', color: 'blue' },
      { label: 'Analytics', action: 'analytics', color: 'orange' }
    ]
  },
  find_best_selling_products: {
    title: 'Product Analytics',
    description: 'Analyze product performance and trends',
    icon: TrendingUp,
    actions: [
      { label: 'View Reports', action: 'reports', color: 'blue' },
      { label: 'Export Data', action: 'export', color: 'green' },
      { label: 'Set Alerts', action: 'alerts', color: 'purple' }
    ]
  },
  general_inquiry: {
    title: 'General Help',
    description: 'Get help with your store and business',
    icon: HelpCircle,
    actions: [
      { label: 'View Documentation', action: 'docs', color: 'blue' },
      { label: 'Contact Support', action: 'support', color: 'green' },
      { label: 'FAQ', action: 'faq', color: 'orange' }
    ]
  }
}

export function IntentDetection({ currentIntent, onIntentAction, className = '' }: IntentDetectionProps) {
  const [showActions, setShowActions] = useState(false)
  const [lastIntent, setLastIntent] = useState<Intent | null>(null)

  useEffect(() => {
    if (currentIntent && currentIntent.intent !== lastIntent?.intent) {
      setLastIntent(currentIntent)
      setShowActions(true)
      
      // Auto-hide after 10 seconds
      setTimeout(() => setShowActions(false), 10000)
    }
  }, [currentIntent, lastIntent])

  const getIntentConfig = (intent: string) => {
    return INTENT_ACTIONS[intent as keyof typeof INTENT_ACTIONS] || INTENT_ACTIONS.general_inquiry
  }

  const handleAction = (action: string) => {
    if (currentIntent) {
      onIntentAction(currentIntent.intent, action)
      setShowActions(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!currentIntent || !showActions) {
    return null
  }

  const intentConfig = getIntentConfig(currentIntent.intent)
  const IconComponent = intentConfig.icon

  return (
    <div className={`intent-detection ${className}`}>
      <Card className="border-l-4 border-l-blue-500 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{intentConfig.title}</CardTitle>
              <CardDescription>{intentConfig.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Confidence</div>
              <div className={`text-lg font-semibold ${getConfidenceColor(currentIntent.confidence)}`}>
                {Math.round(currentIntent.confidence * 100)}%
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-slate-600 mb-3">
              I detected you&apos;re looking for: <span className="font-medium text-slate-900">&quot;{currentIntent.intent}&quot;</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {intentConfig.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAction(action.action)}
                  className={`w-full justify-start border-${action.color}-300 text-${action.color}-700 hover:bg-${action.color}-50`}
                >
                  <span className={`w-2 h-2 bg-${action.color}-500 rounded-full mr-2`}></span>
                  {action.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowActions(false)}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Dismiss
              </button>
              
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>Auto-hide in:</span>
                <span className="font-mono">10s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IntentDetection
