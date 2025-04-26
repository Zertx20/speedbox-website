"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Package } from "lucide-react"
import { AnimatedButton } from "@/components/animated-button"
import { FadeInSection } from "@/components/fade-in-section"
import { ParticlesBackground } from "@/components/particles-background"
import { ScrollProgress } from "@/components/scroll-progress"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <ParticlesBackground />
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
            <Link
              href="/"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-primary relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary relative group">
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
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-primary relative group"
            >
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
                    About SpeedBox
                  </h1>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Fast, secure, and reliable package delivery service in Algeria
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative mx-auto"
              >
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-pulse-soft"></div>
                <Image
                  src="/logo3.png"
                  width={400}
                  height={400}
                  alt="About SpeedBox"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full relative z-10"
                />
              </motion.div>
              <FadeInSection direction="left">
                <div className="flex flex-col justify-center space-y-4">
                  <h2 className="text-2xl font-bold text-white">Our Story</h2>
                  <p className="text-gray-300">
                    SpeedBox was founded in 2020 with a simple mission: to provide fast, reliable, and secure package
                    delivery services across Algeria. We recognized the growing need for efficient logistics solutions
                    in our country and set out to build a service that would meet those needs.
                  </p>
                  <p className="text-gray-300">
                    Starting with just a small team in Algiers, we've now expanded to major cities across the country,
                    including Oran, Constantine, and Annaba. Our commitment to excellence and customer satisfaction has
                    made us one of the leading delivery services in Algeria.
                  </p>
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
                    Our Mission
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We're on a mission to revolutionize package delivery in Algeria by providing a service that is fast,
                    secure, and transparent.
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <FadeInSection delay={0.1}>
                <div className="flex flex-col justify-center space-y-4 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white">Vision</h3>
                  <p className="text-gray-300">
                    To become the most trusted and efficient package delivery service in North Africa, known for our
                    reliability, transparency, and customer-centric approach.
                  </p>
                </div>
              </FadeInSection>
              <FadeInSection delay={0.3}>
                <div className="flex flex-col justify-center space-y-4 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white">Values</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Reliability: We deliver on our promises, every time.</li>
                    <li>• Transparency: We provide real-time tracking and clear communication.</li>
                    <li>• Security: We ensure the safety of every package.</li>
                    <li>• Innovation: We continuously improve our services.</li>
                    <li>• Customer Focus: We put our customers at the center of everything we do.</li>
                  </ul>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Our Team
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Meet the dedicated professionals behind SpeedBox
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              {team.map((member, index) => (
                <FadeInSection key={index} delay={index * 0.2}>
                  <div className="flex flex-col items-center space-y-4 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      className="h-40 w-40 overflow-hidden rounded-full bg-gradient-to-r from-primary/20 to-accent/20 p-1"
                    >
                      <Image
                        src="/placeholder.svg?height=160&width=160"
                        width={160}
                        height={160}
                        alt={member.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </motion.div>
                    <div className="space-y-2 text-center">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-gray-300">{member.role}</p>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-conic bg-[length:200%_200%] animate-background-wave relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Join Us Today</h2>
                <p className="max-w-[900px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience the best delivery service in Algeria
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <AnimatedButton size="lg" className="bg-white text-gray-900 hover:bg-gray-100 hover:shadow-neon">
                    Sign Up Now
                  </AnimatedButton>
                </Link>
                <Link href="/contact">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="glass text-white border-white/20 hover:border-white/40"
                  >
                    Contact Us
                  </AnimatedButton>
                </Link>
              </div>
            </motion.div>
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

const team = [
  {
    name: "Zeriouh Mouad",
    role: "Founder & CEO",
  },
  {
    name: "Zerrouki Abderrahmene",
    role: "Operations Director",
  },
  {
    name: "Settah Omar",
    role: "Technology Lead",
  },
]
