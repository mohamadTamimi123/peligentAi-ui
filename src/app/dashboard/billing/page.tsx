'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CreditCard, Zap, CheckCircle2, AlertCircle } from 'lucide-react'

type PurchaseState = 'idle' | 'loading' | 'success' | 'error'

interface PackageOption {
  id: string
  name: string
  tokens: number
  priceUSD: number
  popular?: boolean
}

export default function BillingPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<PackageOption[]>([])
  const [selected, setSelected] = useState<PackageOption | null>(null)
  const [status, setStatus] = useState<PurchaseState>('idle')
  const [message, setMessage] = useState<string>('')
  const [isAuthed, setIsAuthed] = useState<boolean>(false)
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (!user || !token) {
      router.push('/login')
      return
    }
    setIsAuthed(true)
    
    const fetchPlans = async () => {
      try {
        const authToken = localStorage.getItem('token') || localStorage.getItem('authToken')
        const res = await fetch('http://127.0.0.1:5008/api/billing/plans', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })
        if (!res.ok) throw new Error('Failed to load plans')
        const data = await res.json().catch(() => ({}))
        const raw = Array.isArray(data) ? data : (data?.plans || [])
        const mapped: PackageOption[] = raw.map((p: any, idx: number) => ({
          id: String(p.id ?? p._id ?? p.planId ?? `plan-${idx}`),
          name: String(p.name ?? p.title ?? p.label ?? `Plan ${idx + 1}`),
          tokens: Number(p.tokens ?? p.credits ?? p.tokenAmount ?? 0),
          priceUSD: Number(p.priceUSD ?? p.price ?? p.amountUSD ?? 0),
          popular: Boolean(p.popular ?? (idx === 1))
        })).filter((p: PackageOption) => p.tokens > 0)
        setPlans(mapped)
        setSelected(mapped.find(p => p.popular) || mapped[0] || null)
      } catch (_) {
        setPlans([])
        setSelected(null)
      } finally {
        setIsLoadingPlans(false)
      }
    }
    fetchPlans()
  }, [router])

  const handlePurchase = async () => {
    if (!selected) return
    try {
      setStatus('loading')
      setMessage('')
      const authToken = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!authToken) {
        setStatus('error')
        setMessage('Authentication required')
        return
      }

      // Try preferred endpoint first; backend may expose different paths
      const endpoints = 
        'http://127.0.0.1:5008/api/auth/purchase-tokens'

      let response: Response | null = null
     
        try {
          response = await fetch(endpoints, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              packageId: selected.id,
              tokens: selected.tokens,
              amountUSD: selected.priceUSD
            })
          })
          if (response.ok) {
            
          }
        } catch (_) {
          // try next endpoint
        }
     

      if (!response) throw new Error('No response from server')
      if (!response.ok) {
        const err = await response.text()
        throw new Error(err || 'Purchase failed')
      }

      const data = await response.json().catch(() => ({}))
      const serverMsg = data?.message || 'Purchase successful'
      setStatus('success')
      setMessage(serverMsg)
    } catch (err: any) {
      setStatus('error')
      setMessage(err?.message || 'Something went wrong')
    }
  }

  if (!isAuthed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">Buy Tokens</h1>
              <div className="px-2 py-1 bg-blue-50 rounded-md">
                <span className="text-xs font-medium text-blue-600">Billing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {isLoadingPlans && (
            <>
              {[0,1,2].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 w-24 bg-gray-100 rounded mb-4"></div>
                  <div className="h-6 w-32 bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-100 rounded"></div>
                </div>
              ))}
            </>
          )}
          {!isLoadingPlans && plans.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg)}
              className={`text-left bg-white border rounded-2xl p-6 transition-all ${
                selected && selected.id === pkg.id
                  ? 'border-blue-500 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                {pkg.popular && (
                  <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded-full">Popular</span>
                )}
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{pkg.tokens.toLocaleString()} tokens</div>
              <div className="text-sm text-gray-500">${pkg.priceUSD} USD</div>
            </button>
          ))}
          {!isLoadingPlans && plans.length === 0 && (
            <div className="col-span-full p-6 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-600">
              No plans available.
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Purchase Summary</h3>
                <p className="text-sm text-gray-500">Selected package details</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-gray-500">Package</div>
              <div className="font-medium text-gray-900">{selected?.name || '-'}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-gray-500">Tokens</div>
              <div className="font-medium text-gray-900">{selected ? selected.tokens.toLocaleString() : '-'}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-gray-500">Price</div>
              <div className="font-medium text-gray-900">{selected ? `$${selected.priceUSD} USD` : '-'}</div>
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={status === 'loading' || !selected}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {status === 'loading' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {selected ? `Buy ${selected.tokens.toLocaleString()} Tokens` : 'Select a plan'}
              </>
            )}
          </Button>

          {status === 'success' && (
            <div className="mt-4 flex items-center p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              <span>{message || 'Purchase successful'}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 flex items-center p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>{message || 'Something went wrong'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


