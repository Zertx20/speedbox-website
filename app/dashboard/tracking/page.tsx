"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, LogOut, CheckCircle, Truck, Search, Bell, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getActiveDeliveries, getUserProfile } from "../delivery-actions";
import { useToast } from "@/components/ui/use-toast";

export default function TrackingPage() {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDeliveriesList, setActiveDeliveriesList] = useState<any[]>([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const { toast } = useToast();
  const [userName, setUserName] = useState('User');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  
  // Fetch user deliveries
  const fetchUserDeliveries = async () => {
    if (isConfirmed !== true) return;
    
    setLoadingDeliveries(true);
    try {
      // Fetch active deliveries
      const activeResult = await getActiveDeliveries();
      if ('deliveries' in activeResult) {
        setActiveDeliveriesList(activeResult.deliveries || []);
      }
    } catch (err: any) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoadingDeliveries(false);
    }
  };

  useEffect(() => {
    const fetchConfirmationStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError("Unable to get user info");
          setLoading(false);
          return;
        }
        // Fetch the profile directly from Supabase (client-side)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_confirmed")
          .eq("id", user.id)
          .single();
        if (profileError) {
          setError(profileError.message);
        } else if (typeof profile?.is_confirmed === "boolean") {
          setIsConfirmed(profile.is_confirmed);
        } else {
          setError("Profile not found");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmationStatus();
  }, []);

  // Fetch deliveries and user info when confirmation status changes
  useEffect(() => {
    if (isConfirmed === true) {
      fetchUserDeliveries();
      fetchUserInfo();
    }
  }, [isConfirmed]);

  // Get user profile to set user name
  const fetchUserInfo = async () => {
    try {
      // Use the server action to get profile data
      const result = await getUserProfile();
      
      if ('profile' in result && result.profile) {
        const profile = result.profile;
        
        // Set user name for header display
        if (profile.full_name) {
          setUserName(profile.full_name);
        }
        
        console.log('User profile loaded:', profile);
      } else if ('error' in result) {
        console.error('Error fetching user profile:', result.error);
      }
    } catch (error) {
      console.error('Error in fetchUserInfo:', error);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-red-500">
        <span>{error}</span>
      </div>
    );
  }

  if (isConfirmed === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-yellow-400">
        <div className="p-8 bg-gray-800 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Account Not Confirmed</h2>
          <p className="mb-2">You need to visit an agency with your ID to confirm your account.</p>
          <p>Once confirmed, you'll be able to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Only show dashboard if isConfirmed === true
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
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/tracking" className="text-sm font-medium transition-colors text-primary">
              Tracking
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium transition-colors hover:text-primary">
              History
            </Link>
            <Link href="/dashboard/new" className="text-sm font-medium transition-colors hover:text-primary">
              New Delivery
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">{userName}</span>
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
            Active Deliveries
          </motion.h1>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search deliveries..."
              className="w-[200px] pl-8 bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
            />
          </div>
        </div>

        <FadeInSection>
          <AnimatedCard className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Active Deliveries</CardTitle>
              <CardDescription className="text-gray-400">Track your packages in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Delivery ID</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Tracking</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDeliveries ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <div className="flex justify-center">
                          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : activeDeliveriesList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400 py-4">
                        No active deliveries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeDeliveriesList.map((delivery) => (
                      <TableRow key={delivery.id} className="border-gray-700">
                        <TableCell className="font-medium text-gray-300">{delivery.id.substring(0, 8)}</TableCell>
                        <TableCell className="text-gray-300">{delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={delivery.status === "In Transit" ? "default" : "outline"}
                            className={
                              delivery.status === "In Transit"
                                ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                : delivery.status === "Pending"
                                  ? "bg-amber-500/20 text-amber-500 border-amber-500/30"
                                  : "bg-primary/20 text-primary border-primary/30"
                            }
                          >
                            {delivery.status || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/dashboard/tracking/${delivery.id}`}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            View Tracking
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                                onClick={() => setSelectedDelivery(delivery)}
                              >
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-gray-100">
                              <DialogHeader>
                                <DialogTitle className="text-primary">Delivery Details</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Complete information about this delivery
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-medium text-primary mb-2">Delivery Information</h3>
                                    <p className="text-sm mb-1"><span className="text-gray-400">ID:</span> {delivery.id}</p>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Status:</span> {delivery.status || 'Pending'}</p>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Date:</span> {delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : '-'}</p>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Package Type:</span> {delivery.package_type || '-'}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-primary mb-2">Route Information</h3>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Origin:</span> {delivery.origin_wilaya || '-'}</p>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Destination:</span> {delivery.destination_wilaya || '-'}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <h3 className="font-medium text-primary mb-2">Sender Information</h3>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Name:</span> {delivery.sender_name || '-'}</p>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Phone:</span> {delivery.sender_phone || '-'}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-primary mb-2">Receiver Information</h3>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Name:</span> {delivery.receiver_name || '-'}</p>
                                    <p className="text-sm mb-1"><span className="text-gray-400">Phone:</span> {delivery.receiver_phone || '-'}</p>
                                  </div>
                                </div>
                                
                                {(delivery.package_description || delivery.delivery_notes) && (
                                  <div className="mt-2">
                                    <h3 className="font-medium text-primary mb-2">Additional Information</h3>
                                    {delivery.package_description && (
                                      <div className="mb-2">
                                        <p className="text-sm text-gray-400">Package Description:</p>
                                        <p className="text-sm bg-gray-700/50 p-2 rounded">{delivery.package_description}</p>
                                      </div>
                                    )}
                                    {delivery.delivery_notes && (
                                      <div>
                                        <p className="text-sm text-gray-400">Delivery Notes:</p>
                                        <p className="text-sm bg-gray-700/50 p-2 rounded">{delivery.delivery_notes}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </AnimatedCard>
        </FadeInSection>
      </main>
    </div>
  );
}
