"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, User, LogOut, Users, Truck, CheckCircle, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"
import { Textarea } from "@/components/ui/textarea"
import React from "react"

export default function AdminDashboardPage() {
  // Add error handling for ResizeObserver errors
  React.useEffect(() => {
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <ScrollProgress />

      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
              <Package className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              SpeedBox Admin
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">Admin Panel</span>
            <Link href="/logout">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </Link>
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
            Admin Dashboard
          </motion.h1>
        </div>

        <FadeInSection>
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">156</div>
                <p className="text-xs text-gray-400">+24 from last month</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Active Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">42</div>
                <p className="text-xs text-gray-400">Currently in transit</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Pending Verifications</CardTitle>
                <User className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">18</div>
                <p className="text-xs text-gray-400">Awaiting approval</p>
              </CardContent>
            </AnimatedCard>
          </div>
        </FadeInSection>

        <Tabs defaultValue="users" className="mb-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              User Management
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              Delivery Management
            </TabsTrigger>
            <TabsTrigger
              value="new-delivery"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              New Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <AnimatedCard className="bg-gray-800/50 border-gray-700">
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
                  />
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                  >
                    Export
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Phone</TableHead>
                      <TableHead className="text-gray-300">Verified</TableHead>
                      <TableHead className="text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell className="font-medium text-gray-300">{user.name}</TableCell>
                        <TableCell className="text-gray-300">{user.email}</TableCell>
                        <TableCell className="text-gray-300">{user.phone}</TableCell>
                        <TableCell>
                          {user.verified ? (
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
                          {!user.verified ? (
                            <div className="flex justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 border-gray-700 hover:border-green-500 hover:bg-green-500/20"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 border-gray-700 hover:border-red-500 hover:bg-red-500/20"
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </motion.div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="deliveries" className="space-y-4">
            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Delivery Management</CardTitle>
                <CardDescription className="text-gray-400">Manage and update delivery status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Input
                    placeholder="Search deliveries..."
                    className="max-w-sm bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                  />
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                  >
                    Export
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Delivery ID</TableHead>
                      <TableHead className="text-gray-300">Customer</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((delivery) => (
                      <TableRow key={delivery.id} className="border-gray-700">
                        <TableCell className="font-medium text-gray-300">{delivery.id}</TableCell>
                        <TableCell className="text-gray-300">{delivery.customer}</TableCell>
                        <TableCell className="text-gray-300">{delivery.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              delivery.status === "Delivered"
                                ? "success"
                                : delivery.status === "In Transit"
                                  ? "default"
                                  : delivery.status === "Processing"
                                    ? "outline"
                                    : "secondary"
                            }
                            className={
                              delivery.status === "Delivered"
                                ? "bg-green-500/20 text-green-500 border-green-500/30"
                                : delivery.status === "In Transit"
                                  ? "bg-primary/20 text-primary border-primary/30"
                                  : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                            }
                          >
                            {delivery.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="new-delivery" className="space-y-4">
            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Create New Delivery</CardTitle>
                <CardDescription className="text-gray-400">Add a new delivery to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sender-name" className="text-gray-300">
                          Sender Name
                        </Label>
                        <Input
                          id="sender-name"
                          placeholder="Full name"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sender-phone" className="text-gray-300">
                          Sender Phone
                        </Label>
                        <Input
                          id="sender-phone"
                          placeholder="+213 XX XX XX XX"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
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
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="origin-wilaya" className="text-gray-300">
                          Origin Wilaya
                        </Label>
                        <Select>
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
                        <Select>
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
                        <Select>
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
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                >
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white">
                  <Plus className="mr-2 h-4 w-4" /> Create Delivery
                </Button>
              </CardFooter>
            </AnimatedCard>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="container flex h-16 items-center justify-between">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} SpeedBox Admin. All rights reserved.</p>
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

const users = [
  {
    id: "1",
    name: "Ahmed Benali",
    email: "ahmed.benali@example.com",
    phone: "+213 555 123 456",
    verified: true,
  },
  {
    id: "2",
    name: "Samira Hadj",
    email: "samira.hadj@example.com",
    phone: "+213 555 789 012",
    verified: true,
  },
  {
    id: "3",
    name: "Karim Mezouar",
    email: "karim.mezouar@example.com",
    phone: "+213 555 345 678",
    verified: false,
  },
  {
    id: "4",
    name: "Leila Bouaziz",
    email: "leila.bouaziz@example.com",
    phone: "+213 555 901 234",
    verified: false,
  },
  {
    id: "5",
    name: "Omar Taleb",
    email: "omar.taleb@example.com",
    phone: "+213 555 567 890",
    verified: true,
  },
]

const deliveries = [
  {
    id: "DEL-1234",
    customer: "Ahmed Benali",
    date: "2023-04-15",
    status: "In Transit",
  },
  {
    id: "DEL-1235",
    customer: "Samira Hadj",
    date: "2023-04-16",
    status: "Processing",
  },
  {
    id: "DEL-1236",
    customer: "Karim Mezouar",
    date: "2023-04-17",
    status: "In Transit",
  },
  {
    id: "DEL-1237",
    customer: "Leila Bouaziz",
    date: "2023-04-18",
    status: "Delivered",
  },
  {
    id: "DEL-1238",
    customer: "Omar Taleb",
    date: "2023-04-19",
    status: "Processing",
  },
]

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
