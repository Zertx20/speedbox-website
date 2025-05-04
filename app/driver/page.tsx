"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, LogOut, CheckCircle, Truck, Bell, XCircle, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { getPendingDeliveries, getActiveDeliveries, getDeliveryHistory, acceptDelivery, updateDeliveryStatus } from "./driver-actions"

export default function DriverPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  
  // State for loading and user status
  const [loading, setLoading] = useState(true)
  const [driverName, setDriverName] = useState('Driver')
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [acceptingDelivery, setAcceptingDelivery] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false) // Track any ongoing acceptance
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  // State for deliveries data
  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>([])
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([])
  const [historyDeliveries, setHistoryDeliveries] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  
  // State for stats
  const [stats, setStats] = useState({
    availableCount: 0,
    activeCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    totalEarnings: 0
  })
  
  // Check if user is logged in and is a driver
  useEffect(() => {
    const fetchDriverStatus = async () => {
      setLoading(true)
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          setError("Authentication error. Please sign in again.")
          setLoading(false)
          return
        }
        
        // Check user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, role, is_confirmed")
          .eq("id", user.id)
          .single()
        
        if (profileError) {
          setError(profileError.message)
          setLoading(false)
          return
        }
        
        // Set user name
        if (profile.full_name) {
          setDriverName(profile.full_name.split(' ')[0]) // First name only
        }
        
        // Check if user is a driver
        if (profile.role !== 'driver') {
          router.push('/dashboard')
          return
        }
        
        // Check if account is confirmed
        setIsConfirmed(profile.is_confirmed)
        
        // If confirmed, fetch data
        if (profile.is_confirmed) {
          fetchDeliveries()
        }
        
      } catch (err) {
        console.error("Error checking driver status:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }
    
    fetchDriverStatus()
    
    // Add error handler for ResizeObserver errors (same as admin dashboard)
    const errorHandler = (event: ErrorEvent) => {
      if (event.message.includes("ResizeObserver")) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    
    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [router, supabase])
  
  // Function to fetch all deliveries data
  const fetchDeliveries = async () => {
    setLoadingData(true)
    try {
      // Fetch all delivery types in parallel (just like admin dashboard)
      const [pendingResult, activeResult, historyResult] = await Promise.all([
        getPendingDeliveries(),
        getActiveDeliveries(),
        getDeliveryHistory()
      ])
      
      // Process pending deliveries
      if ('deliveries' in pendingResult) {
        setPendingDeliveries(pendingResult.deliveries || [])
        setStats(prev => ({
          ...prev,
          availableCount: pendingResult.deliveries?.length || 0
        }))
      }
      
      // Process active deliveries  
      if ('deliveries' in activeResult) {
        setActiveDeliveries(activeResult.deliveries || [])
        setStats(prev => ({
          ...prev,
          activeCount: activeResult.deliveries?.length || 0
        }))
      }
      
      // Process history deliveries and calculate stats
      if ('deliveries' in historyResult) {
        setHistoryDeliveries(historyResult.deliveries || [])
        
        // Calculate stats from history
        const completed = historyResult.deliveries.filter(d => d.status === 'Delivered') || []
        const cancelled = historyResult.deliveries.filter(d => d.status === 'Cancelled') || []
        
        // Calculate total earnings (70% of price for delivered packages)
        const earnings = completed.reduce((total, delivery) => {
          return total + (delivery.driver_earnings || 0)
        }, 0)
        
        setStats(prev => ({
          ...prev,
          completedCount: completed.length,
          cancelledCount: cancelled.length,
          totalEarnings: earnings
        }))
      }
      
    } catch (err) {
      console.error("Error fetching deliveries:", err)
      toast({
        title: "Error",
        description: "Failed to fetch deliveries data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoadingData(false)
    }
  }
  
  // Handle delivery acceptance
  const handleAcceptDelivery = async (deliveryId: string) => {
    setAcceptingDelivery(deliveryId) // Track which specific delivery is being accepted
    setIsAccepting(true) // Set global accepting state
    try {
      console.log("Starting acceptance for delivery ID:", deliveryId)
      const result = await acceptDelivery(deliveryId)
      console.log("Acceptance result:", result)
      
      if ('error' in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Success",
          description: "Delivery accepted successfully"
        })
        // Refresh data
        fetchDeliveries()
      }
    } catch (err) {
      console.error("Error accepting delivery:", err)
      toast({
        title: "Error",
        description: "Failed to accept delivery. Please try again.",
        variant: "destructive"
      })
    } finally {
      setAcceptingDelivery(null) // Reset accepting state
      setIsAccepting(false) // Reset global accepting state
    }
  }
  
  // Handle delivery status update
  const handleUpdateStatus = async (deliveryId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const result = await updateDeliveryStatus(deliveryId, newStatus)
      
      if ('error' in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Success",
          description: `Delivery marked as ${newStatus}`
        })
        // Refresh data
        fetchDeliveries()
      }
    } catch (err) {
      console.error("Error updating delivery status:", err)
      toast({
        title: "Error",
        description: "Failed to update delivery status. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUpdatingStatus(false)
    }
  }
  
  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-900 text-white">
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h2 className="text-xl font-medium text-gray-300">Loading driver dashboard...</h2>
          </div>
        </main>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-900 text-white">
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-medium text-gray-300 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-400 text-center max-w-md mb-4">{error}</p>
            <Button 
              onClick={() => router.push("/")}
              variant="outline" 
              className="border-gray-700 text-primary hover:text-primary hover:border-primary"
            >
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    )
  }
  
  // Unconfirmed account state
  if (isConfirmed === false) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-900 text-white">
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-300 mb-2">Account Verification Pending</h2>
            <p className="text-gray-400 text-center max-w-md mb-4">
              Your driver account is still being verified. Please visit a SpeedBox agency with your ID to complete verification.
            </p>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="border-gray-700 text-primary hover:text-primary hover:border-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </main>
      </div>
    )
  }
  
  // Main dashboard UI
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <ScrollProgress />
      
      {/* Header with Logo */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 text-primary font-bold text-xl">
              <Package className="h-6 w-6" />
              <span>SpeedBox Driver</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-5 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Welcome to SpeedBox Driver Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-300 max-w-3xl"
          >
            Track and manage your deliveries from this dashboard. Remember, you can only have one active delivery at a time.
          </motion.p>
        </div>
        
        {/* Stats summary */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-amber-400" />
            Driver Dashboard
          </h2>
          <FadeInSection>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-300 flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-primary" />
                    Available
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.availableCount}</div>
                  <p className="text-sm text-gray-400">Pending deliveries</p>
                </CardContent>
              </AnimatedCard>
              
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-300 flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-blue-400" />
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{stats.activeCount}</div>
                  <p className="text-sm text-gray-400">In transit deliveries</p>
                </CardContent>
              </AnimatedCard>
              
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-300 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{stats.completedCount}</div>
                  <p className="text-sm text-gray-400">Delivered successfully</p>
                </CardContent>
              </AnimatedCard>
              
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-300 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-amber-400" />
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-400">{stats.totalEarnings.toLocaleString()} DA</div>
                  <p className="text-sm text-gray-400">Total completed earnings</p>
                </CardContent>
              </AnimatedCard>
            </div>
          </FadeInSection>
        </div>
        
        {/* Available deliveries section */}
        <FadeInSection>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Available Deliveries
            </h2>
            
            {/* Delivery limitation notice */}
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-4 text-sm text-blue-100 flex items-start">
              <Truck className="h-4 w-4 text-blue-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Driver Policy:</p>
                <p>You can only accept one delivery at a time. Complete or return your active delivery before accepting a new one.</p>
              </div>
            </div>
            
            {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : pendingDeliveries.length > 0 ? (
              <div className="space-y-4">
                {pendingDeliveries.map((delivery) => (
                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-slate-950 rounded-lg border border-gray-100 dark:border-slate-800 shadow-sm p-4 relative"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          {delivery.sender_name} → {delivery.recipient_name}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {delivery.origin_wilaya || ''} → {delivery.destination_wilaya || ''}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                            {delivery.package_type}
                          </span>
                          <span className="text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-2 py-1 rounded-full">
                            {delivery.delivery_type || delivery.service_type}
                          </span>
                          <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded-full">
                            {delivery.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-gray-400">{new Date(delivery.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{(delivery.price || 0).toLocaleString()} DA</div>
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Earnings: {(delivery.driver_earnings || 0).toLocaleString()} DA
                        </div>
                        <div className="mt-2">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleAcceptDelivery(delivery.id)}
                            disabled={acceptingDelivery === delivery.id || stats.activeCount > 0 || isAccepting}
                          >
                            {acceptingDelivery === delivery.id ? "Accepting..." : 
                             stats.activeCount > 0 ? "Complete Active Delivery First" : 
                             isAccepting ? "Processing..." : "Accept Delivery"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg p-6 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Available Deliveries</h3>
                  <p className="text-gray-400 max-w-md mb-4">
                    There are no pending deliveries available to accept at the moment.
                  </p>
                </div>
              </AnimatedCard>
            )}
          </div>
        </FadeInSection>
        
        {/* Active deliveries section */}
        <FadeInSection>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-blue-400" />
              Active Delivery
              {stats.activeCount > 0 && (
                <span className="ml-2 text-xs font-normal bg-blue-600 text-white px-2 py-1 rounded-full">
                  You must complete this before accepting new deliveries
                </span>
              )}
            </h2>
            
            {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : activeDeliveries.length > 0 ? (
              <div className="space-y-4">
                {activeDeliveries.map((delivery) => (
                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-slate-950 rounded-lg border border-gray-100 dark:border-slate-800 shadow-sm p-4 relative"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          {delivery.sender_name} → {delivery.recipient_name}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {delivery.origin_wilaya || ''} → {delivery.destination_wilaya || ''}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                            {delivery.package_type}
                          </span>
                          <span className="text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-2 py-1 rounded-full">
                            {delivery.delivery_type || delivery.service_type}
                          </span>
                          <span className="text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 px-2 py-1 rounded-full">
                            {delivery.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-gray-400">{new Date(delivery.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{(delivery.price || 0).toLocaleString()} DA</div>
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Earnings: {(delivery.driver_earnings || 0).toLocaleString()} DA
                        </div>
                        <div className="mt-2 space-y-2">
                          <Button 
                            size="sm" 
                            className="w-full"
                            variant="success"
                            onClick={() => handleUpdateStatus(delivery.id, 'Delivered')}
                            disabled={updatingStatus}
                          >
                            Mark as Delivered
                          </Button>
                          <Button 
                            size="sm" 
                            className="w-full"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(delivery.id, 'Returned')}
                            disabled={updatingStatus}
                          >
                            Mark as Returned
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg p-6 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Active Deliveries</h3>
                  <p className="text-gray-400 max-w-md mb-4">
                    You don't have any active deliveries. Accept deliveries from the available list above.
                  </p>
                </div>
              </AnimatedCard>
            )}
          </div>
        </FadeInSection>
        
        {/* Delivery history section */}
        <FadeInSection>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Delivery History
            </h2>
            
            {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : historyDeliveries.length > 0 ? (
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-700">
                  {historyDeliveries.slice(0, 5).map((delivery) => (
                    <div key={delivery.id} className="p-4 hover:bg-gray-800/80 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full ${delivery.status === 'Delivered' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                            <p className="font-medium text-gray-300">{delivery.origin_wilaya} to {delivery.destination_wilaya}</p>
                          </div>
                          <p className="text-sm text-gray-400 mt-1 ml-4">
                            {new Date(delivery.created_at).toLocaleDateString()} • {delivery.package_type} • {delivery.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${delivery.status === 'Delivered' ? 'text-green-400' : 'text-gray-400'}`}>
                            {delivery.status === 'Delivered' ? `${(delivery.driver_earnings || 0)} DA` : 'No earnings'}
                          </div>
                          {delivery.status === 'Delivered' && (
                            <div className="text-xs text-gray-400">Completed</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {historyDeliveries.length > 5 && (
                  <div className="p-3 bg-gray-800/80 border-t border-gray-700 text-center">
                    <Button 
                      onClick={() => router.push('/driver/history')} 
                      variant="link" 
                      className="text-primary text-sm hover:underline"
                    >
                      View all {historyDeliveries.length} completed deliveries
                    </Button>
                  </div>
                )}
              </AnimatedCard>
            ) : (
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg p-6 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Delivery History</h3>
                  <p className="text-gray-400 max-w-md mb-4">
                    You haven't completed any deliveries yet. Start by accepting available deliveries.
                  </p>
                </div>
              </AnimatedCard>
            )}
          </div>
        </FadeInSection>
      </main>
    </div>
  )
}