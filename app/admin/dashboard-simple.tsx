"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, User, LogOut, Users, Truck, CheckCircle, XCircle, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { getDeliveries } from "./actions"
import { getAllUsers } from "./user-actions"
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()
  
  // State for stats
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDeliveries: 0,
    pendingVerifications: 0,
    completedDeliveries: 0,
    cancelledDeliveries: 0
  })
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData()
    
    // Add error handler for ResizeObserver errors
    const errorHandler = (event: ErrorEvent) => {
      if (event.message.includes("ResizeObserver")) {
        // Prevent the error from being displayed in the console
        event.preventDefault()
        event.stopPropagation()
      }
    }
    
    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])
  
  // Fetch all required data
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch users and deliveries in parallel
      const [usersResult, deliveriesResult] = await Promise.all([
        getAllUsers(),
        getDeliveries()
      ])
      
      // Process users data
      if ('users' in usersResult && usersResult.users) {
        const pendingCount = usersResult.users.filter(user => !user.is_confirmed).length
        
        setStats(prev => ({
          ...prev,
          totalUsers: usersResult.users.length,
          pendingVerifications: pendingCount
        }))
      }
      
      // Process deliveries data
      if ('deliveries' in deliveriesResult && deliveriesResult.deliveries) {
        const activeCount = deliveriesResult.deliveries.filter(
          delivery => delivery.status !== 'Delivered' && delivery.status !== 'Cancelled'
        ).length
        
        const completedCount = deliveriesResult.deliveries.filter(
          delivery => delivery.status === 'Delivered'
        ).length
        
        const cancelledCount = deliveriesResult.deliveries.filter(
          delivery => delivery.status === 'Cancelled'
        ).length
        
        setStats(prev => ({
          ...prev,
          activeDeliveries: activeCount,
          completedDeliveries: completedCount,
          cancelledDeliveries: cancelledCount
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <ScrollProgress />

      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
              <img src="/logo4.png" alt="SpeedBox Logo" className="h-12 w-12 object-contain" />
            </motion.div>
            <span className="text-xl font-bold text-cyan-400">
              SpeedBox Admin
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium transition-colors text-primary">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium transition-colors hover:text-primary">
              Users
            </Link>
            <Link href="/admin/deliveries" className="text-sm font-medium transition-colors hover:text-primary">
              Deliveries
            </Link>
            <Link href="/admin/new" className="text-sm font-medium transition-colors hover:text-primary">
              New Delivery
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">Admin Panel</span>
            <Button
              variant="outline"
              size="icon"
              className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Admin Dashboard
          </motion.h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-primary border-r-2 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <>
            <FadeInSection>
              <div className="grid gap-6 md:grid-cols-3 mb-10">
                <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-200">Total Users</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                    <p className="text-xs text-gray-400 mt-1">Total registered users</p>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-200">Active Deliveries</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.activeDeliveries}</div>
                    <p className="text-xs text-gray-400 mt-1">Currently in transit</p>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-200">Pending Verifications</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.pendingVerifications}</div>
                    <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
                  </CardContent>
                </AnimatedCard>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="grid gap-6 md:grid-cols-2 mb-10">
                <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-200">Completed Deliveries</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.completedDeliveries}</div>
                    <p className="text-xs text-gray-400 mt-1">Successfully delivered</p>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-200">Cancelled Deliveries</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.cancelledDeliveries}</div>
                    <p className="text-xs text-gray-400 mt-1">Cancelled orders</p>
                  </CardContent>
                </AnimatedCard>
              </div>
            </FadeInSection>

            <FadeInSection>
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Button 
                  onClick={() => router.push('/admin/users')} 
                  className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-auto py-3 px-4 justify-start"
                  variant="ghost"
                >
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Manage Users</span>
                    <span className="text-xs text-gray-400 mt-1">Verify and manage accounts</span>
                  </div>
                </Button>

                <Button 
                  onClick={() => router.push('/admin/deliveries')} 
                  className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-auto py-3 px-4 justify-start"
                  variant="ghost"
                >
                  <Truck className="h-5 w-5 mr-3 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Manage Deliveries</span>
                    <span className="text-xs text-gray-400 mt-1">Track and update status</span>
                  </div>
                </Button>

                <Button 
                  onClick={() => router.push('/admin/new')} 
                  className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-auto py-3 px-4 justify-start"
                  variant="ghost"
                >
                  <Plus className="h-5 w-5 mr-3 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Create Delivery</span>
                    <span className="text-xs text-gray-400 mt-1">Add a new delivery</span>
                  </div>
                </Button>
              </div>
            </FadeInSection>
          </>
        )}
      </main>
    </div>
  );
}
