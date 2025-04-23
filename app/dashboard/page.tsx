"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, LogOut, CheckCircle, Truck, Search, Bell, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { AnimatedCard } from "@/components/animated-card"
import { FadeInSection } from "@/components/fade-in-section"
import { ScrollProgress } from "@/components/scroll-progress"

export default function DashboardPage() {
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
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Bell className="h-5 w-5" />
              </Button>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
            </motion.div>

            <span className="text-sm font-medium text-gray-300">Welcome, Ahmed</span>
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
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-gray-400">+2 from last month</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Active Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <p className="text-xs text-gray-400">Currently in transit</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Completed Deliveries</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">9</div>
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
                    {activeDeliveries.map((delivery) => (
                      <TableRow key={delivery.id} className="border-gray-700">
                        <TableCell className="font-medium text-gray-300">{delivery.id}</TableCell>
                        <TableCell className="text-gray-300">{delivery.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={delivery.status === "In Transit" ? "default" : "outline"}
                            className="bg-primary/20 text-primary border-primary/30"
                          >
                            {delivery.status}
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    {deliveryHistory.map((delivery) => (
                      <TableRow key={delivery.id} className="border-gray-700">
                        <TableCell className="font-medium text-gray-300">{delivery.id}</TableCell>
                        <TableCell className="text-gray-300">{delivery.date}</TableCell>
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary"
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
                {upcomingDeliveries.map((delivery, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                        {delivery.type === "pickup" ? (
                          <Package className="h-5 w-5 text-primary" />
                        ) : (
                          <Truck className="h-5 w-5 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{delivery.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{delivery.date}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{delivery.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                      {delivery.type === "pickup" ? "Pickup" : "Delivery"}
                    </Badge>
                  </div>
                ))}
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

const activeDeliveries = [
  {
    id: "DEL-1234",
    date: "2023-04-15",
    status: "In Transit",
  },
  {
    id: "DEL-1235",
    date: "2023-04-16",
    status: "Processing",
  },
  {
    id: "DEL-1236",
    date: "2023-04-17",
    status: "In Transit",
  },
]

const deliveryHistory = [
  {
    id: "DEL-1230",
    date: "2023-03-10",
    status: "Delivered",
  },
  {
    id: "DEL-1231",
    date: "2023-03-15",
    status: "Delivered",
  },
  {
    id: "DEL-1232",
    date: "2023-03-20",
    status: "Cancelled",
  },
  {
    id: "DEL-1233",
    date: "2023-03-25",
    status: "Delivered",
  },
]

const upcomingDeliveries = [
  {
    title: "Package from Algiers",
    date: "Apr 25, 2023",
    time: "10:00 AM - 12:00 PM",
    type: "delivery",
  },
  {
    title: "Document pickup",
    date: "Apr 26, 2023",
    time: "2:00 PM - 4:00 PM",
    type: "pickup",
  },
  {
    title: "Electronics delivery",
    date: "Apr 28, 2023",
    time: "9:00 AM - 11:00 AM",
    type: "delivery",
  },
]
