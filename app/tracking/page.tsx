'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Package, ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }
    
    setIsSubmitting(true)
    router.push(`/tracking/${trackingId.trim()}`)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Logo */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-blue-400 font-bold text-xl">
              <Package className="h-6 w-6" />
              <span>SpeedBox</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/" passHref>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Home
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Track Your Delivery</h1>
          <p className="text-gray-300 mb-8">
            Enter your tracking ID to see real-time status updates and delivery information
          </p>
          
          <div className="bg-gray-800 shadow-xl border border-gray-700 rounded-lg p-8 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="tracking-id" className="text-sm font-medium text-gray-300 text-left">
                  Tracking ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="tracking-id"
                    type="text"
                    placeholder="Enter your tracking ID"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                {error && <p className="text-sm text-red-400 text-left font-medium">{error}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Searching...' : 'Track Package'}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-300">
                Need help with your delivery? Contact our customer support at{' '}
                <a 
                  href="mailto:support@speedbox.com" 
                  className="text-blue-400 hover:underline font-medium"
                >
                  support@speedbox.com
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center shadow-md hover:shadow-blue-900/20 hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Track Anytime</h3>
            <p className="text-gray-300">
              Real-time tracking for all your packages with detailed status updates
            </p>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center shadow-md hover:shadow-blue-900/20 hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Detailed Information</h3>
            <p className="text-gray-300">
              View complete journey details and estimated delivery times
            </p>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center shadow-md hover:shadow-blue-900/20 hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Share & Access</h3>
            <p className="text-gray-300">
              Easily share tracking IDs with recipients for transparent delivery monitoring
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xl">
                <Package className="h-6 w-6" />
                <span>SpeedBox</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Fast, reliable delivery services across Algeria
              </p>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SpeedBox. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
