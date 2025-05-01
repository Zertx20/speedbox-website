"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { User, LogOut, CheckCircle, XCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { getAllUsers, toggleUserStatus } from "../user-actions"
import { useRouter } from 'next/navigation'

export default function AdminUsersPage() {
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()
  
  // State for users and admin info
  const [profilesList, setProfilesList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [adminName, setAdminName] = useState('Admin')
  
  // Stats for dashboard cards
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    verifiedUsers: 0
  })
  
  // Fetch all user profiles for user management
  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const result = await getAllUsers()
      if ('error' in result && result.error) {
        console.error('Error fetching profiles:', result.error)
      } else if ('users' in result) {
        setProfilesList(result.users || [])
        
        // Update stats
        if (result.users) {
          const verifiedCount = result.users.filter(user => user.is_confirmed).length
          const pendingCount = result.users.filter(user => !user.is_confirmed).length
          
          setStats({
            totalUsers: result.users.length,
            pendingVerifications: pendingCount,
            verifiedUsers: verifiedCount
          })
        }
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
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
  
  // Fetch users on component mount
  useEffect(() => {
    fetchProfiles()
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
  
  // Handle toggling user status
  const handleToggleUserStatus = async (userId: string, isConfirmed: boolean) => {
    try {
      const result = await toggleUserStatus(userId, isConfirmed)
      if ('error' in result && result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: isConfirmed 
            ? "User verified successfully" 
            : "User unverified successfully",
        })
        fetchProfiles() // Refresh user list
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }
  
  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  // Filter users based on search query
  const filteredUsers = searchQuery 
    ? profilesList.filter(user => 
        (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.phone && user.phone.includes(searchQuery))
      )
    : profilesList

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
            <Link href="/admin/users" className="text-sm font-medium transition-colors text-primary">
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
            User Management
          </motion.h1>
        </div>

        <FadeInSection>
          <div className="grid gap-6 md:grid-cols-3 mb-6">
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
                <CardTitle className="text-sm font-medium text-gray-200">Verified Users</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.verifiedUsers}</div>
                <p className="text-xs text-gray-400 mt-1">Confirmed accounts</p>
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
          <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-100">User Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage user accounts and verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Search users..."
                  className="max-w-sm bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                  onClick={() => {
                    // Simple CSV export functionality
                    const headers = ["Name", "Email", "Phone", "Verified"];
                    const csvData = [
                      headers.join(","),
                      ...filteredUsers.map(user => [
                        user.full_name || "No Name",
                        user.email || "No Email",
                        user.phone || "No Phone",
                        user.is_confirmed ? "Yes" : "No"
                      ].join(","))
                    ].join("\n");
                    
                    const blob = new Blob([csvData], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('hidden', '');
                    a.setAttribute('href', url);
                    a.setAttribute('download', 'users.csv');
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
                    <TableRow className="border-gray-700 bg-gray-800/50">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Phone</TableHead>
                      <TableHead className="text-gray-300">Verified</TableHead>
                      <TableHead className="text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <div className="flex justify-center">
                            <div className="animate-spin h-5 w-5 rounded-full border-t-2 border-primary border-r-2 border-b-2 border-gray-800"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-400 py-4">
                          {searchQuery ? "No users match your search" : "No users found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-gray-700">
                          <TableCell className="font-medium text-gray-300">{user.full_name || 'No Name'}</TableCell>
                          <TableCell className="text-gray-300">{user.email || 'No Email'}</TableCell>
                          <TableCell className="text-gray-300">{user.phone || 'No Phone'}</TableCell>
                          <TableCell>
                            {user.is_confirmed ? (
                              <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 border-gray-700 hover:border-green-500 hover:bg-green-500/20"
                                  onClick={() => handleToggleUserStatus(user.id, true)}
                                  disabled={user.is_confirmed}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Verify</span>
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 border-gray-700 hover:border-red-500 hover:bg-red-500/20"
                                  onClick={() => handleToggleUserStatus(user.id, false)}
                                  disabled={!user.is_confirmed}
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Unverify</span>
                                </Button>
                              </motion.div>
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
