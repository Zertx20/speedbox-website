"use client"

import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ParticlesBackground } from "@/components/particles-background"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <ParticlesBackground />

      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
        <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
          <Package className="h-6 w-6 text-primary" />
        </motion.div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          SpeedBox
        </span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
            <CardDescription className="text-gray-300">Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-200">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.example@gmail.com"
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-200">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+213 XX XX XX XX"
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>
              <div className="text-sm text-gray-400">
                <p>
                  After signing up, you must visit a physical agency to confirm your identity with an ID before you can
                  use the platform.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
