"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/animated-button"
import { FadeInSection } from "@/components/fade-in-section"
import { ParticlesBackground } from "@/components/particles-background"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCard } from "@/components/animated-card"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <ParticlesBackground />
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
            <Link
              href="/"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-primary relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-primary relative group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-primary relative group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <AnimatedButton variant="outline" size="sm" className="glass-dark border-gray-700 text-gray-200">
                Login
              </AnimatedButton>
            </Link>
            <Link href="/signup">
              <AnimatedButton
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white"
              >
                Sign Up
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Contact Us
                  </h1>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We're here to help. Get in touch with our team.
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <FadeInSection delay={0.1}>
                <AnimatedCard className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Send us a message</CardTitle>
                    <CardDescription className="text-gray-300">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name" className="text-gray-200">
                            First name
                          </Label>
                          <Input
                            id="first-name"
                            placeholder="John"
                            className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name" className="text-gray-200">
                            Last name
                          </Label>
                          <Input
                            id="last-name"
                            placeholder="Doe"
                            className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-200">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+213 XX XX XX XX"
                          className="bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-200">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          className="min-h-[120px] bg-gray-800 border-gray-700 text-gray-300 focus:border-primary"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </AnimatedCard>
              </FadeInSection>
              <FadeInSection delay={0.3} direction="left">
                <div className="flex flex-col justify-center space-y-8 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold text-white">Our Locations</h3>
                      <p className="text-gray-300">
                        Main Office: 123 Didouche Mourad Street, Algiers
                        <br />
                        Branch Offices: Oran, Constantine, Annaba
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold text-white">Email Us</h3>
                      <p className="text-gray-300">
                        General Inquiries: info@speedbox.dz
                        <br />
                        Customer Support: support@speedbox.dz
                        <br />
                        Business Partnerships: partners@speedbox.dz
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold text-white">Call Us</h3>
                      <p className="text-gray-300">
                        Customer Service: +213 XX XX XX XX
                        <br />
                        Business Line: +213 XX XX XX XX
                        <br />
                        Working Hours: 8:00 AM - 8:00 PM, Sunday to Thursday
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Our Agencies
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Visit one of our physical locations across Algeria
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              {agencies.map((agency, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <AnimatedCard className="bg-gray-800/50 border-gray-700 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">{agency.city}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">{agency.address}</p>
                      <p className="text-sm text-gray-300 mt-2">{agency.phone}</p>
                      <p className="text-sm text-gray-300">{agency.hours}</p>
                    </CardContent>
                  </AnimatedCard>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="container flex flex-col gap-6 py-8 md:py-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <Package className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  SpeedBox
                </span>
              </div>
              <p className="text-sm text-gray-400">Fast, secure, and real-time package delivery service in Algeria.</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-200">Company</h3>
              <ul className="space-y-2">
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Link href="/about" className="text-sm text-gray-400 hover:text-primary">
                      About Us
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Link href="/contact" className="text-sm text-gray-400 hover:text-primary">
                      Contact
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Link href="/careers" className="text-sm text-gray-400 hover:text-primary">
                      Careers
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-200">Help</h3>
              <ul className="space-y-2">
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Link href="/faq" className="text-sm text-gray-400 hover:text-primary">
                      FAQ
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Link href="/support" className="text-sm text-gray-400 hover:text-primary">
                      Support
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Link href="/terms" className="text-sm text-gray-400 hover:text-primary">
                      Terms of Service
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Link href="/privacy" className="text-sm text-gray-400 hover:text-primary">
                      Privacy Policy
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-200">Connect</h3>
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:shadow-neon-accent"
                >
                  <Link href="https://facebook.com" className="text-gray-400 hover:text-accent">
                    <span className="sr-only">Facebook</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:shadow-neon-accent"
                >
                  <Link href="https://instagram.com" className="text-gray-400 hover:text-accent">
                    <span className="sr-only">Instagram</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:shadow-neon-accent"
                >
                  <Link href="https://linkedin.com" className="text-gray-400 hover:text-primary">
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          <motion.div
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} SpeedBox. All rights reserved.</p>
            <p className="text-xs text-gray-500">Made with ❤️ in Algeria</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

const agencies = [
  {
    city: "Algiers",
    address: "123 Didouche Mourad Street, Algiers",
    phone: "+213 XX XX XX XX",
    hours: "8:00 AM - 8:00 PM",
  },
  {
    city: "Oran",
    address: "45 Boulevard Emir Abdelkader, Oran",
    phone: "+213 XX XX XX XX",
    hours: "8:00 AM - 8:00 PM",
  },
  {
    city: "Constantine",
    address: "78 Avenue Zighoud Youcef, Constantine",
    phone: "+213 XX XX XX XX",
    hours: "8:00 AM - 8:00 PM",
  },
  {
    city: "Annaba",
    address: "12 Rue d'Amman, Annaba",
    phone: "+213 XX XX XX XX",
    hours: "8:00 AM - 8:00 PM",
  },
]
