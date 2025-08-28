import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Agent UI</span>
            </div>
            <p className="text-gray-600 max-w-xs">
              Modern, responsive web applications built with Next.js and Tailwind CSS.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link href="/status" className="text-gray-600 hover:text-gray-900 transition-colors">Status</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Agent UI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
