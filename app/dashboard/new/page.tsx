"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, LogOut, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { createDelivery, getUserProfile } from "../delivery-actions";
import { useToast } from "@/components/ui/use-toast";

export default function NewDeliveryPage() {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState('User');
  
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

  // Fetch user info when confirmation status changes
  useEffect(() => {
    if (isConfirmed === true) {
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
        
        // Redirect to tracking page
        router.push('/dashboard/tracking');
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
            <Link href="/dashboard/tracking" className="text-sm font-medium transition-colors hover:text-primary">
              Tracking
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium transition-colors hover:text-primary">
              History
            </Link>
            <Link href="/dashboard/new" className="text-sm font-medium transition-colors text-primary">
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
            Create New Delivery
          </motion.h1>
        </div>

        <FadeInSection>
          <AnimatedCard className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">New Delivery</CardTitle>
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
        </FadeInSection>
      </main>
    </div>
  );
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
  { code: "16", name: "Alger", value: "alger" },
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
  { code: "49", name: "El M'Ghair", value: "el-mghair" },
  { code: "50", name: "El Meniaa", value: "el-meniaa" },
  { code: "51", name: "Ouled Djellal", value: "ouled-djellal" },
  { code: "52", name: "Bordj Badji Mokhtar", value: "bordj-badji-mokhtar" },
  { code: "53", name: "Béni Abbès", value: "beni-abbes" },
  { code: "54", name: "Timimoun", value: "timimoun" },
  { code: "55", name: "Touggourt", value: "touggourt" },
  { code: "56", name: "Djanet", value: "djanet" },
  { code: "57", name: "In Salah", value: "in-salah" },
  { code: "58", name: "In Guezzam", value: "in-guezzam" }
];
