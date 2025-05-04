"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, LogOut, CheckCircle, Truck, XCircle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { getDeliveries, updateDeliveryStatus } from "../actions"
import { useRouter } from 'next/navigation'

export default function AdminDeliveriesPage() {
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()
  
  // State for deliveries and admin info
  const [deliveriesList, setDeliveriesList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [adminName, setAdminName] = useState('Admin')
  const [copiedId, setCopiedId] = useState("")
  
  // Stats for dashboard cards
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    cancelledDeliveries: 0
  })
  
  // Fetch deliveries from Supabase
  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const result = await getDeliveries()
      
      if ('error' in result && result.error) {
        console.error('Error fetching deliveries:', result.error)
      } else if ('deliveries' in result) {
        setDeliveriesList(result.deliveries || [])
        
        // Update stats
        if (result.deliveries) {
          const activeCount = result.deliveries.filter(
            delivery => delivery.status !== 'Delivered' && delivery.status !== 'Cancelled'
          ).length
          
          const completedCount = result.deliveries.filter(
            delivery => delivery.status === 'Delivered'
          ).length
          
          const cancelledCount = result.deliveries.filter(
            delivery => delivery.status === 'Cancelled'
          ).length
          
          setStats({
            totalDeliveries: result.deliveries.length,
            activeDeliveries: activeCount,
            completedDeliveries: completedCount,
            cancelledDeliveries: cancelledCount
          })
        }
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch admin info
  const fetchAdminInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Get admin profile from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single()
        
        if (profile && profile.full_name) {
          setAdminName(profile.full_name)
        } else if (user.email) {
          // Fallback to email if no name is set
          setAdminName(user.email.split('@')[0])
        }
      }
    } catch (error) {
      console.error('Error fetching admin info:', error)
    }
  }
  
  // Fetch deliveries on component mount
  useEffect(() => {
    fetchDeliveries()
    fetchAdminInfo()
    
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
  
  // Handle updating delivery status
  const handleUpdateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const result = await updateDeliveryStatus(deliveryId, newStatus)
      if ('error' in result && result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Delivery status updated to ${newStatus}`,
        })
        fetchDeliveries() // Refresh deliveries list
      }
    } catch (error) {
      console.error('Error updating delivery status:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }
  
  // Copy delivery tracking URL to clipboard
  const copyDeliveryId = async (id: string) => {
    try {
      // Copy the full tracking URL with https://
      const fullUrl = `https://speedbox46.vercel.app/tracking/${id}`;
      await navigator.clipboard.writeText(fullUrl);
      
      // Set copied state for this specific ID
      setCopiedId(id);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedId("");
      }, 2000);
      
      toast({
        title: "Copied!",
        description: "Tracking link copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy tracking link",
        variant: "destructive",
      });
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }
  
  // Filter deliveries based on search query and status filter
  const filteredDeliveries = deliveriesList
    .filter(delivery => {
      // Apply status filter
      if (statusFilter !== "all") {
        return delivery.status === statusFilter
      }
      return true
    })
    .filter(delivery => {
      // Apply search filter if query exists
      if (!searchQuery) return true
      
      const query = searchQuery.toLowerCase()
      return (
        (delivery.id && delivery.id.toLowerCase().includes(query)) ||
        (delivery.sender_name && delivery.sender_name.toLowerCase().includes(query)) ||
        (delivery.receiver_name && delivery.receiver_name.toLowerCase().includes(query)) ||
        (delivery.origin_wilaya && delivery.origin_wilaya.toLowerCase().includes(query)) ||
        (delivery.destination_wilaya && delivery.destination_wilaya.toLowerCase().includes(query))
      )
    })

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <ScrollProgress />

      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
              <img src="/logo4.png" alt="SpeedBox Logo" className="h-12 w-12 object-contain" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              SpeedBox
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium transition-colors hover:text-primary">
              Users
            </Link>
            <Link href="/admin/deliveries" className="text-sm font-medium transition-colors text-primary">
              Deliveries
            </Link>
            <Link href="/admin/new" className="text-sm font-medium transition-colors hover:text-primary">
              New Delivery
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">{adminName}</span>
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

      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Delivery Management
          </motion.h1>
        </div>

        <FadeInSection>
          <div className="grid gap-6 md:grid-cols-4 mb-6">
            <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Total Deliveries</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalDeliveries}</div>
                <p className="text-xs text-gray-400 mt-1">All deliveries</p>
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
                <CardTitle className="text-sm font-medium text-gray-200">Completed</CardTitle>
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
                <CardTitle className="text-sm font-medium text-gray-200">Cancelled</CardTitle>
                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.cancelledDeliveries}</div>
                <p className="text-xs text-gray-400 mt-1">Cancelled deliveries</p>
              </CardContent>
            </AnimatedCard>
          </div>
        </FadeInSection>

        <FadeInSection>
          <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-100">Delivery Management</CardTitle>
              <CardDescription className="text-gray-400">Manage and update delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Input
                    placeholder="Search deliveries..."
                    className="w-full sm:w-64 bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-gray-300 focus:border-primary">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                  onClick={() => {
                    // Simple CSV export functionality
                    const headers = ["ID", "Sender", "Receiver", "Origin", "Destination", "Date", "Status"];
                    const csvData = [
                      headers.join(","),
                      ...filteredDeliveries.map(delivery => [
                        delivery.id ? delivery.id.substring(0, 8) : "N/A",
                        delivery.sender_name || "N/A",
                        delivery.receiver_name || "N/A",
                        delivery.origin_wilaya || "N/A",
                        delivery.destination_wilaya || "N/A",
                        delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : "N/A",
                        delivery.status || "Pending"
                      ].join(","))
                    ].join("\n");
                    
                    const blob = new Blob([csvData], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('hidden', '');
                    a.setAttribute('href', url);
                    a.setAttribute('download', 'deliveries.csv');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  Export
                </Button>
              </div>
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">ID</TableHead>
                      <TableHead className="text-gray-300">Sender</TableHead>
                      <TableHead className="text-gray-300">Route</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Status Update</TableHead>
                      <TableHead className="text-gray-300">Tracking Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex justify-center">
                            <div className="animate-spin h-5 w-5 rounded-full border-t-2 border-primary border-r-2 border-b-2 border-gray-800"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredDeliveries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-400 py-4">
                          {searchQuery || statusFilter !== "all" ? "No deliveries match your filters" : "No deliveries found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDeliveries.map((delivery) => (
                        <TableRow key={delivery.id} className="border-gray-700">
                          <TableCell className="font-medium text-gray-300">{delivery.id.substring(0, 8)}</TableCell>
                          <TableCell className="text-gray-300">{delivery.sender_name}</TableCell>
                          <TableCell className="text-gray-300">{delivery.origin_wilaya} → {delivery.destination_wilaya}</TableCell>
                          <TableCell className="text-gray-300">{delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className={
                                delivery.status === "Delivered"
                                  ? "bg-green-500/20 text-green-500 border-green-500/30"
                                  : delivery.status === "In Transit"
                                    ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                    : delivery.status === "Cancelled"
                                      ? "bg-red-500/20 text-red-500 border-red-500/30"
                                      : delivery.status === "Failed"
                                        ? "bg-red-500/20 text-red-500 border-red-500/30"
                                        : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                              }
                            >
                              {delivery.status || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              onValueChange={(value) => handleUpdateDeliveryStatus(delivery.id, value)}
                              defaultValue={delivery.status || "Pending"}
                            >
                              <SelectTrigger className="w-[130px] bg-gray-800 border-gray-700 text-gray-300 h-8">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Transit">In Transit</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => router.push(`/tracking/${delivery.id}`)}
                                className="text-blue-400 border-blue-400 hover:bg-blue-900 hover:text-blue-100"
                              >
                                <ExternalLink size={14} className="mr-1" />
                                Track
                              </Button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyDeliveryId(delivery.id);
                                }}
                                className="p-1.5 hover:bg-gray-700 rounded flex items-center gap-1"
                                title="Copy Tracking Link"
                              >
                                {copiedId === delivery.id ? (
                                  <>
                                    <CheckCircle size={16} className="text-green-400" />
                                    <span className="text-xs text-green-400">Copied</span>
                                  </>
                                ) : (
                                  <Copy size={16} className="text-blue-400" />
                                )}
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </AnimatedCard>
        </FadeInSection>
      </main>
    </div>
  );
}
