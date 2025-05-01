'use client'

import { useState } from 'react'
import Link from "next/link"
import { User, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ParticlesBackground } from "@/components/particles-background"
import { signup } from "./actions"
import { useRouter } from 'next/navigation'



export default function SignupPage() {
  const [userType, setUserType] = useState<'client' | 'driver'>('client')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Simple password match validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }


    setError('') // Clear previous errors
    setIsLoading(true)

    try {
      // Call your signup function here
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('fullName', fullName)
      formData.append('phone', phone)
      formData.append('role', userType)

      const result = await signup(formData) // Calling your signup function
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <ParticlesBackground />

      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
        <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
        <img src="/logo4.png" alt="SpeedBox Logo" className="h-12 w-12 object-contain" />
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserType('client')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${userType === 'client' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'}`}
                >
                  <User className="w-8 h-8" />
                  <span className="font-medium">Client</span>
                </motion.button>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserType('driver')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${userType === 'driver' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'}`}
                >
                  <Truck className="w-8 h-8" />
                  <span className="font-medium">Driver</span>
                </motion.button>
              </div>
              {error && <div className="text-red-500">{error}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-200">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+213 XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
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
