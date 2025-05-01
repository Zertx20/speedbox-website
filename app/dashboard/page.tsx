"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, LogOut, CheckCircle, Truck, Bell, Plus, Clock, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getActiveDeliveries, getDeliveryHistory, getUpcomingDeliveries, getUserProfile } from "./delivery-actions";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDeliveriesList, setActiveDeliveriesList] = useState<any[]>([]);
  const [deliveryHistoryList, setDeliveryHistoryList] = useState<any[]>([]);
  const [upcomingDeliveriesList, setUpcomingDeliveriesList] = useState<any[]>([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const { toast } = useToast();
  const [userName, setUserName] = useState('User');
  const [hasNotifications, setHasNotifications] = useState(false);
  
  // Fetch summary data for dashboard
  const fetchDashboardData = async () => {
    if (isConfirmed !== true) return;
    
    setLoadingDeliveries(true);
    try {
      // Fetch data in parallel for better performance
      const [activeResult, historyResult, upcomingResult] = await Promise.all([
        getActiveDeliveries(),
        getDeliveryHistory(),
        getUpcomingDeliveries()
      ]);
      
      // Update state with results
      if ('deliveries' in activeResult) {
        setActiveDeliveriesList(activeResult.deliveries || []);
      }
      
      if ('deliveries' in historyResult) {
        setDeliveryHistoryList(historyResult.deliveries || []);
      }
      
      if ('deliveries' in upcomingResult) {
        setUpcomingDeliveriesList(upcomingResult.deliveries || []);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
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

  // Fetch dashboard data and user info when confirmation status changes
  useEffect(() => {
    if (isConfirmed === true) {
      fetchDashboardData();
    }
  }, [isConfirmed]);

  // Fetch user info on component mount for all users (confirmed or not)
  useEffect(() => {
    if (!loading && !error) {
      fetchUserInfo();
    }
  }, [loading, error]);

  // Get user profile to set user name - works for both confirmed and unconfirmed users
  const fetchUserInfo = async () => {
    try {
      // First try to get user directly from Supabase
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user found');
        return;
      }
      
      // Use the server action to get profile data
      const result = await getUserProfile();
      
      if ('profile' in result && result.profile) {
        const profile = result.profile;
        
        // Set user name for header display
        if (profile.full_name) {
          setUserName(profile.full_name);
        } else if (user.email) {
          // Fallback to email if no name is set
          setUserName(user.email.split('@')[0]);
        }
        
        console.log('User profile loaded:', profile);
      } else if ('error' in result) {
        console.error('Error fetching user profile:', result.error);
        
        // Fallback to email from auth if profile fetch fails
        if (user.email) {
          setUserName(user.email.split('@')[0]);
        }
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

  // Check for notifications when upcoming deliveries change
  useEffect(() => {
    setHasNotifications(upcomingDeliveriesList.length > 0);
  }, [upcomingDeliveriesList]);

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

        <main className="flex-1 container py-8">
          <motion.div 
            className="flex flex-col items-start mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Welcome, {userName}
            </h1>
            <p className="text-gray-400 mt-1">Your account requires verification</p>
          </motion.div>

          <FadeInSection>
            <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Account Verification Required</CardTitle>
                <CardDescription className="text-gray-400">
                  Your account is pending verification to ensure security and trust
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <h3 className="text-amber-400 font-medium flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Verification Status: Pending
                  </h3>
                  <p className="text-gray-300">Your account has been created successfully but requires in-person verification before you can access delivery services.</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Why We Require Verification</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-white mb-1">Security</h4>
                      <p className="text-sm text-gray-400">Protects against fraud and ensures all users are verified individuals.</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-white mb-1">Trust</h4>
                      <p className="text-sm text-gray-400">Creates a trusted community of verified senders and receivers.</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-white mb-1">Safety</h4>
                      <p className="text-sm text-gray-400">Ensures safe delivery of packages by confirming identities of all users.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">How to Complete Verification</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-primary/20 text-primary h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">1</div>
                      <div>
                        <p className="text-gray-300 font-medium">Visit a SpeedBox Agency</p>
                        <p className="text-sm text-gray-400">Locate your nearest SpeedBox agency using our agency locator.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/20 text-primary h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">2</div>
                      <div>
                        <p className="text-gray-300 font-medium">Bring Required Documents</p>
                        <p className="text-sm text-gray-400">Bring a valid government-issued ID (passport, national ID, or driver's license).</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/20 text-primary h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">3</div>
                      <div>
                        <p className="text-gray-300 font-medium">Complete Verification</p>
                        <p className="text-sm text-gray-400">Our staff will verify your identity and activate your account immediately.</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="pt-4 border-t border-gray-700 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => window.open('https://maps.google.com/search?q=speedbox+agency', '_blank')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Find Nearest Agency
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                    onClick={() => toast({
                      title: "Contact Support",
                      description: "Our support team is available at support@speedbox.com"
                    })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </AnimatedCard>
          </FadeInSection>
        </main>
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
            <Link href="/dashboard" className="text-sm font-medium transition-colors text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/tracking" className="text-sm font-medium transition-colors hover:text-primary">
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
            <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-primary"
                onClick={() => {
                  if (upcomingDeliveriesList.length > 0) {
                    toast({
                      title: "Upcoming Deliveries",
                      description: `You have ${upcomingDeliveriesList.length} upcoming ${upcomingDeliveriesList.length === 1 ? 'delivery' : 'deliveries'} scheduled.`,
                      variant: "default"
                    });
                  } else {
                    toast({
                      title: "No Notifications",
                      description: "You don't have any upcoming deliveries scheduled.",
                      variant: "default"
                    });
                  }
                }}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {hasNotifications && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
              )}
            </motion.div>

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

      <main className="flex-1 container py-8">
        <motion.div 
          className="flex flex-col items-start mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Welcome, {userName}
          </h1>
          <p className="text-gray-400 mt-1">Manage and track your deliveries</p>
        </motion.div>

        {loadingDeliveries ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-primary border-r-2 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">Total Deliveries</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{activeDeliveriesList.length + deliveryHistoryList.length}</div>
                  <p className="text-xs text-gray-400 mt-1">All time deliveries</p>
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
                  <div className="text-3xl font-bold text-white">{activeDeliveriesList.length}</div>
                  <p className="text-xs text-gray-400 mt-1">Currently in transit</p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">Completed Deliveries</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{deliveryHistoryList.filter(d => d.status === "Delivered").length}</div>
                  <p className="text-xs text-gray-400 mt-1">Successfully delivered</p>
                </CardContent>
              </AnimatedCard>
            </div>
          </>
        )}

        <FadeInSection>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Upcoming Deliveries</h2>
            {upcomingDeliveriesList.length > 0 ? (
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-700">
                  {upcomingDeliveriesList.slice(0, 5).map((delivery) => (
                    <div key={delivery.id} className="p-4 hover:bg-gray-800/80 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-accent mr-2"></div>
                            <p className="font-medium text-gray-300">{delivery.origin_wilaya} to {delivery.destination_wilaya}</p>
                          </div>
                          <p className="text-sm text-gray-400 mt-1 ml-4">
                            {delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : 'No date'} • {delivery.package_type || 'Package'}
                          </p>
                        </div>
                        <Button 
                          onClick={() => router.push(`/dashboard/tracking/${delivery.id}`)}
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {upcomingDeliveriesList.length > 5 && (
                  <div className="p-3 bg-gray-800/80 border-t border-gray-700 text-center">
                    <Button 
                      onClick={() => router.push('/dashboard/tracking')} 
                      variant="link" 
                      className="text-primary text-sm hover:underline"
                    >
                      View all {upcomingDeliveriesList.length} upcoming deliveries
                    </Button>
                  </div>
                )}
              </AnimatedCard>
            ) : (
              <AnimatedCard className="bg-gray-800/50 border-gray-700 shadow-lg p-6 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Upcoming Deliveries</h3>
                  <p className="text-gray-400 max-w-md mb-4">You don't have any deliveries scheduled for the next 7 days.</p>
                  <Button 
                    onClick={() => router.push('/dashboard/new')} 
                    variant="outline" 
                    className="border-gray-700 text-primary hover:text-primary hover:border-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Delivery
                  </Button>
                </div>
              </AnimatedCard>
            )}
          </div>
        </FadeInSection>
      </main>
    </div>
  );
}
