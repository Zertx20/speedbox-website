"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, LogOut, CheckCircle, Truck, Search, Bell, Calendar, Clock, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getActiveDeliveries, getDeliveryHistory, getUpcomingDeliveries, createDelivery, getUserProfile } from "./delivery-actions";
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
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState('User');
  const [hasNotifications, setHasNotifications] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  
  // Form state for new delivery
  const [formData, setFormData] = useState({
    origin_wilaya: '',
    destination_wilaya: '',
    package_type: '',
    delivery_date: new Date().toISOString().split('T')[0]
  });
  
  // Use local state for form inputs to avoid re-renders during typing
  const [localInputs, setLocalInputs] = useState({
    sender_name: '',
    sender_phone: '',
    receiver_name: '',
    receiver_phone: '',
    package_description: '',
    delivery_notes: ''
  });

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
      
      // Fetch delivery history
      const historyResult = await getDeliveryHistory();
      if ('deliveries' in historyResult) {
        setDeliveryHistoryList(historyResult.deliveries || []);
      }
      
      // Fetch upcoming deliveries
      const upcomingResult = await getUpcomingDeliveries();
      if ('deliveries' in upcomingResult) {
        setUpcomingDeliveriesList(upcomingResult.deliveries || []);
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
  
  // Fetch user info on component mount
  useEffect(() => {
    if (!loading && !error) {
      fetchUserInfo();
    }
  }, []);

  // Get user profile to auto-fill sender details and set user name
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
        
        // Auto-fill sender details from user profile
        setLocalInputs(prev => ({
          ...prev,
          sender_name: profile.full_name || '',
          sender_phone: profile.phone || ''
        }));
        
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

  // Check for notifications when upcoming deliveries change
  useEffect(() => {
    setHasNotifications(upcomingDeliveriesList.length > 0);
  }, [upcomingDeliveriesList]);

  // Handle form input changes - using local state first, then update formData on submit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace(/-/g, '_');
    
    // Update local state immediately (fast, no re-renders)
    setLocalInputs(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    
    // Update formData with localInputs before submitting
    const updatedFormData = {
      ...formData,
      ...localInputs
    };
    
    // Create form data for server action
    const formDataObj = new FormData();
    
    // Add all form fields
    Object.entries(updatedFormData).forEach(([key, value]) => {
      // Make sure sender information is included even if fields are read-only
      formDataObj.append(key, value);
    });
    
    // Ensure sender information is included
    if (!formDataObj.get('sender_name') || !formDataObj.get('sender_phone')) {
      formDataObj.set('sender_name', localInputs.sender_name);
      formDataObj.set('sender_phone', localInputs.sender_phone);
    }
    
    try {
      const result = await createDelivery(formDataObj);
      
      if ('error' in result && result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Delivery created successfully"
        });
        
        // Reset form
        setLocalInputs({
          sender_name: localInputs.sender_name, // Keep sender info
          sender_phone: localInputs.sender_phone, // Keep sender info
          receiver_name: '',
          receiver_phone: '',
          package_description: '',
          delivery_notes: ''
        });
        
        setFormData({
          origin_wilaya: '',
          destination_wilaya: '',
          package_type: '',
          delivery_date: new Date().toISOString().split('T')[0]
        });
        
        // Refresh deliveries
        fetchUserDeliveries();
      }
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast({
        title: "Error",
        description: "Failed to create delivery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
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

      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard
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
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Total Deliveries</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{activeDeliveriesList.length + deliveryHistoryList.length}</div>
                <p className="text-xs text-gray-400">All time deliveries</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Active Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{activeDeliveriesList.length}</div>
                <p className="text-xs text-gray-400">Currently in transit</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Completed Deliveries</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{deliveryHistoryList.filter(d => d.status === "Delivered").length}</div>
                <p className="text-xs text-gray-400">Successfully delivered</p>
              </CardContent>
            </AnimatedCard>
          </div>
        </FadeInSection>

        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="active" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              Active Deliveries
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              Delivery History
            </TabsTrigger>
            <TabsTrigger value="new-delivery" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              New Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="new-delivery" className="space-y-4">
            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Create New Delivery</CardTitle>
                <CardDescription className="text-gray-400">Schedule a new package delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sender-name" className="text-gray-300">
                          Sender Name
                        </Label>
                        <Input
                          id="sender-name"
                          placeholder="Your full name"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary cursor-not-allowed"
                          value={localInputs.sender_name}
                          readOnly
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sender-phone" className="text-gray-300">
                          Sender Phone
                        </Label>
                        <Input
                          id="sender-phone"
                          placeholder="+213 XX XX XX XX"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary cursor-not-allowed"
                          value={localInputs.sender_phone}
                          readOnly
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="receiver-name" className="text-gray-300">
                          Receiver Name
                        </Label>
                        <Input
                          id="receiver-name"
                          placeholder="Full name"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                          value={localInputs.receiver_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="receiver-phone" className="text-gray-300">
                          Receiver Phone
                        </Label>
                        <Input
                          id="receiver-phone"
                          placeholder="+213 XX XX XX XX"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                          value={localInputs.receiver_phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="origin-wilaya" className="text-gray-300">
                          Origin Wilaya
                        </Label>
                        <Select onValueChange={(value) => handleSelectChange(value, 'origin_wilaya')} value={formData.origin_wilaya}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary">
                            <SelectValue placeholder="Select wilaya" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300 max-h-[300px] overflow-y-auto">
                            {algeriaWilayas.map((wilaya) => (
                              <SelectItem key={wilaya.code} value={wilaya.value}>
                                {wilaya.code} - {wilaya.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination-wilaya" className="text-gray-300">
                          Destination Wilaya
                        </Label>
                        <Select onValueChange={(value) => handleSelectChange(value, 'destination_wilaya')} value={formData.destination_wilaya}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary">
                            <SelectValue placeholder="Select wilaya" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300 max-h-[300px] overflow-y-auto">
                            {algeriaWilayas.map((wilaya) => (
                              <SelectItem key={wilaya.code} value={wilaya.value}>
                                {wilaya.code} - {wilaya.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="package-type" className="text-gray-300">
                          Package Type
                        </Label>
                        <Select onValueChange={(value) => handleSelectChange(value, 'package_type')} value={formData.package_type}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="small-package">Small Package</SelectItem>
                            <SelectItem value="medium-package">Medium Package</SelectItem>
                            <SelectItem value="large-package">Large Package</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery-date" className="text-gray-300">
                          Delivery Date
                        </Label>
                        <Input
                          id="delivery-date"
                          type="date"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                          value={formData.delivery_date}
                          onChange={(e) => handleSelectChange(e.target.value, 'delivery_date')}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="package-description" className="text-gray-300">
                        Package Description
                      </Label>
                      <Textarea
                        id="package-description"
                        placeholder="Describe the package contents"
                        className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary min-h-[100px]"
                        value={localInputs.package_description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery-notes" className="text-gray-300">
                        Delivery Notes
                      </Label>
                      <Textarea
                        id="delivery-notes"
                        placeholder="Any special instructions for delivery"
                        className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary min-h-[100px]"
                        value={localInputs.delivery_notes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-800 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                      onClick={() => {
                        // Reset form except sender info
                        setLocalInputs({
                          sender_name: localInputs.sender_name,
                          sender_phone: localInputs.sender_phone,
                          receiver_name: '',
                          receiver_phone: '',
                          package_description: '',
                          delivery_notes: ''
                        });
                        setFormData({
                          origin_wilaya: '',
                          destination_wilaya: '',
                          package_type: '',
                          delivery_date: new Date().toISOString().split('T')[0]
                        });
                      }}
                    >
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Create Delivery
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Delivery History</CardTitle>
                <CardDescription className="text-gray-400">View all your past deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Delivery ID</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingDeliveries ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          <div className="flex justify-center">
                            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : deliveryHistoryList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-400 py-4">
                          No delivery history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      deliveryHistoryList.map((delivery) => (
                        <TableRow key={delivery.id} className="border-gray-700">
                          <TableCell className="font-medium text-gray-300">{delivery.id.substring(0, 8)}</TableCell>
                          <TableCell className="text-gray-300">{delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                delivery.status === "Delivered"
                                  ? "success"
                                  : delivery.status === "Cancelled"
                                    ? "destructive"
                                    : "outline"
                              }
                              className={
                                delivery.status === "Delivered"
                                  ? "bg-green-500/20 text-green-500 border-green-500/30"
                                  : delivery.status === "Cancelled"
                                    ? "bg-red-500/20 text-red-500 border-red-500/30"
                                    : "border-gray-600 text-gray-400"
                              }
                            >
                              {delivery.status}
                            </Badge>
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
          </TabsContent>
        </Tabs>

        <FadeInSection delay={0.2}>
          <AnimatedCard className="bg-gray-800/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-gray-100">Upcoming Deliveries</CardTitle>
              <CardDescription className="text-gray-400">Deliveries scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {loadingDeliveries ? (
                  <div className="flex justify-center py-4">
                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : upcomingDeliveriesList.length === 0 ? (
                  <div className="text-center text-gray-400 py-4">
                    No upcoming deliveries scheduled
                  </div>
                ) : (
                  upcomingDeliveriesList.map((delivery, index) => (
                    <div
                      key={delivery.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                          <Truck className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {delivery.package_type ? `${delivery.package_type} Package` : 'Package Delivery'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>{delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : '-'}</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>Expected Delivery</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                        {delivery.status || "Pending"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </AnimatedCard>
        </FadeInSection>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="container flex h-16 items-center justify-between">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} SpeedBox. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Algeria wilayas data for the form
const algeriaWilayas = [
  { code: "01", name: "Adrar", value: "adrar" },
  { code: "02", name: "Chlef", value: "chlef" },
  { code: "03", name: "Laghouat", value: "laghouat" },
  { code: "04", name: "Oum El Bouaghi", value: "oum-el-bouaghi" },
  { code: "05", name: "Batna", value: "batna" },
  { code: "06", name: "Béjaïa", value: "bejaia" },
  { code: "07", name: "Biskra", value: "biskra" },
  { code: "08", name: "Béchar", value: "bechar" },
  { code: "09", name: "Blida", value: "blida" },
  { code: "10", name: "Bouira", value: "bouira" },
  { code: "11", name: "Tamanrasset", value: "tamanrasset" },
  { code: "12", name: "Tébessa", value: "tebessa" },
  { code: "13", name: "Tlemcen", value: "tlemcen" },
  { code: "14", name: "Tiaret", value: "tiaret" },
  { code: "15", name: "Tizi Ouzou", value: "tizi-ouzou" },
  { code: "16", name: "Algiers", value: "algiers" },
  { code: "17", name: "Djelfa", value: "djelfa" },
  { code: "18", name: "Jijel", value: "jijel" },
  { code: "19", name: "Sétif", value: "setif" },
  { code: "20", name: "Saïda", value: "saida" },
  { code: "21", name: "Skikda", value: "skikda" },
  { code: "22", name: "Sidi Bel Abbès", value: "sidi-bel-abbes" },
  { code: "23", name: "Annaba", value: "annaba" },
  { code: "24", name: "Guelma", value: "guelma" },
  { code: "25", name: "Constantine", value: "constantine" },
  { code: "26", name: "Médéa", value: "medea" },
  { code: "27", name: "Mostaganem", value: "mostaganem" },
  { code: "28", name: "M'Sila", value: "msila" },
  { code: "29", name: "Mascara", value: "mascara" },
  { code: "30", name: "Ouargla", value: "ouargla" },
  { code: "31", name: "Oran", value: "oran" },
  { code: "32", name: "El Bayadh", value: "el-bayadh" },
  { code: "33", name: "Illizi", value: "illizi" },
  { code: "34", name: "Bordj Bou Arréridj", value: "bordj-bou-arreridj" },
  { code: "35", name: "Boumerdès", value: "boumerdes" },
  { code: "36", name: "El Tarf", value: "el-tarf" },
  { code: "37", name: "Tindouf", value: "tindouf" },
  { code: "38", name: "Tissemsilt", value: "tissemsilt" },
  { code: "39", name: "El Oued", value: "el-oued" },
  { code: "40", name: "Khenchela", value: "khenchela" },
  { code: "41", name: "Souk Ahras", value: "souk-ahras" },
  { code: "42", name: "Tipaza", value: "tipaza" },
  { code: "43", name: "Mila", value: "mila" },
  { code: "44", name: "Aïn Defla", value: "ain-defla" },
  { code: "45", name: "Naâma", value: "naama" },
  { code: "46", name: "Aïn Témouchent", value: "ain-temouchent" },
  { code: "47", name: "Ghardaïa", value: "ghardaia" },
  { code: "48", name: "Relizane", value: "relizane" },
  { code: "49", name: "Timimoun", value: "timimoun" },
  { code: "50", name: "Bordj Badji Mokhtar", value: "bordj-badji-mokhtar" },
  { code: "51", name: "Ouled Djellal", value: "ouled-djellal" },
  { code: "52", name: "Béni Abbès", value: "beni-abbes" },
  { code: "53", name: "In Salah", value: "in-salah" },
  { code: "54", name: "In Guezzam", value: "in-guezzam" },
  { code: "55", name: "Touggourt", value: "touggourt" },
  { code: "56", name: "Djanet", value: "djanet" },
  { code: "57", name: "El M'Ghair", value: "el-mghair" },
  { code: "58", name: "El Meniaa", value: "el-meniaa" },
]

// Mock data kept as fallback in case the real data fetch fails
// These won't be used unless there's an error with the Supabase connection
