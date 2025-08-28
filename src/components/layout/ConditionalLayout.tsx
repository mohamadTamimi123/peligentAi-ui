'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/otp' || pathname === '/reset-password'
  const isDashboardPage = pathname.startsWith('/dashboard')

  return (
    <>
      {!isAuthPage && !isDashboardPage && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </>
  )
}
