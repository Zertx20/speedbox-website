"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Clock,
  MapPin,
  CreditCard,
  Facebook,
  Instagram,
  Linkedin,
  Package,
  ChevronRight,
  Truck,
  CheckCircle,
  ArrowRight,
  Shield,
  Globe,
} from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedFeatureIcon } from "@/components/animated-feature-icon"
import { AnimatedButton } from "@/components/animated-button"
import { TestimonialSlider } from "@/components/testimonial-slider"
import { StepAnimation } from "@/components/step-animation"
import { ParticlesBackground } from "@/components/particles-background"
import { AnimatedCard } from "@/components/animated-card"
import { DeliveryPathAnimation } from "@/components/delivery-path-animation"
import { CursorSpotlight } from "@/components/cursor-spotlight"
import { FloatingElements } from "@/components/floating-elements"
import { Package3D } from "@/components/3d-package"
import { ScrollProgress } from "@/components/scroll-progress"
import { useRef } from "react"

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      {/* Background Elements */}
      <ParticlesBackground />
      <FloatingElements />
      <CursorSpotlight />
      <ScrollProgress />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
              <img src="/logo4.png" alt="SpeedBox Logo" className="h-12 w-12 object-contain" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              SpeedBox
            </span>
          </motion.div>

          <motion.nav
            className="hidden md:flex items-center gap-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary relative group">
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
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-primary relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </motion.nav>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Redesigned */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="absolute inset-0 z-0">
            <svg
              className="absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              viewBox="0 0 1440 800"
              fill="none"
            >
              <motion.path
                d="M-114,166.5C32.3333,47.1667,323,1,323,1C323,1,570.5,69,700.5,69C830.5,69,1071,1,1071,1C1071,1,1318.5,69,1448.5,69C1578.5,69,1819,1,1819,1"
                stroke="url(#paint0_linear)"
                strokeOpacity="0.2"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M-114,366.5C32.3333,247.167,323,201,323,201C323,201,570.5,269,700.5,269C830.5,269,1071,201,1071,201C1071,201,1318.5,269,1448.5,269C1578.5,269,1819,201,1819,201"
                stroke="url(#paint0_linear)"
                strokeOpacity="0.2"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
              />
              <motion.path
                d="M-114,566.5C32.3333,447.167,323,401,323,401C323,401,570.5,469,700.5,469C830.5,469,1071,401,1071,401C1071,401,1318.5,469,1448.5,469C1578.5,469,1819,401,1819,401"
                stroke="url(#paint0_linear)"
                strokeOpacity="0.2"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#66C2FF" />
                  <stop offset="0.5" stopColor="#FF7A5A" />
                  <stop offset="1" stopColor="#9C27B0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block"
                >
                  <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                    #1 Delivery Service in Algeria
                  </span>
                </motion.div>

                <AnimatedText delay={0.1}>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-accent">
                    Delivering Speed, <br />
                    Security & Reliability
                  </h1>
                </AnimatedText>

                <AnimatedText delay={0.3}>
                  <p className="max-w-[600px] text-gray-300 text-lg">
                    SpeedBox connects Algeria with fast, secure, and real-time package delivery services. Track your
                    deliveries with precision and enjoy peace of mind.
                  </p>
                </AnimatedText>

                <AnimatedText delay={0.5}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/signup">
                      <AnimatedButton
                        size="lg"
                        className="gap-1.5 bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white"
                      >
                        Start Your Delivery
                        <ChevronRight className="h-4 w-4" />
                      </AnimatedButton>
                    </Link>
                    <Link href="/about">
                      <AnimatedButton variant="outline" size="lg" className="glass-dark border-gray-700">
                        Learn More
                      </AnimatedButton>
                    </Link>
                  </div>
                </AnimatedText>

                <motion.div
                  className="flex items-center gap-6 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-300">Real-time Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    <span className="text-sm text-gray-300">Secure Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-300">Nationwide Coverage</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto w-full max-w-md"
              >
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-pulse-soft"></div>
                <div className="relative z-10 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 flex items-center justify-center">
                  <Package3D />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Delivery Path Animation Section */}
        <section className="w-full py-12 md:py-24 bg-gray-800">
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Track Your Delivery in Real-Time
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Watch as your package moves from our warehouse to your doorstep
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto max-w-4xl">
              <DeliveryPathAnimation />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Our Services
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We provide reliable and efficient delivery services to meet your needs.
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 md:gap-12">
              <FadeInSection delay={0.1}>
                <AnimatedCard className="bg-gray-800/50 border-gray-700">
                  <div className="flex flex-col items-center space-y-4">
                    <AnimatedFeatureIcon icon={Clock} className="bg-purple-500/20" />
                    <h3 className="text-xl font-bold text-white">Fast Delivery</h3>
                    <p className="text-center text-gray-300">
                      We ensure your packages reach their destination quickly and efficiently.
                    </p>
                  </div>
                </AnimatedCard>
              </FadeInSection>
              <FadeInSection delay={0.3}>
                <AnimatedCard className="bg-gray-800/50 border-gray-700">
                  <div className="flex flex-col items-center space-y-4">
                    <AnimatedFeatureIcon icon={MapPin} className="bg-green-500/20" />
                    <h3 className="text-xl font-bold text-white">Real-Time Tracking</h3>
                    <p className="text-center text-gray-300">
                      Track your packages in real-time with our advanced tracking system.
                    </p>
                  </div>
                </AnimatedCard>
              </FadeInSection>
              <FadeInSection delay={0.5}>
                <AnimatedCard className="bg-gray-800/50 border-gray-700">
                  <div className="flex flex-col items-center space-y-4">
                    <AnimatedFeatureIcon icon={CreditCard} className="bg-amber-500/20" />
                    <h3 className="text-xl font-bold text-white">Secure Payments</h3>
                    <p className="text-center text-gray-300">
                      Your payments are secure with our trusted payment system.
                    </p>
                  </div>
                </AnimatedCard>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900" ref={targetRef}>
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    How It Works
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Three simple steps to get your package delivered
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 md:gap-12">
              <StepAnimation
                step={1}
                title="Enter Info"
                description="Fill in your delivery details and package information"
              >
                <Package className="h-8 w-8 text-primary" />
              </StepAnimation>
              <StepAnimation
                step={2}
                title="Choose Delivery"
                description="Select your preferred delivery option and time"
              >
                <Truck className="h-8 w-8 text-accent" />
              </StepAnimation>
              <StepAnimation
                step={3}
                title="Track & Receive"
                description="Track your package in real-time until it arrives"
              >
                <CheckCircle className="h-8 w-8 text-green-500" />
              </StepAnimation>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    What Our Customers Say
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Don't just take our word for it. Here's what our customers have to say.
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto max-w-5xl py-12">
              <TestimonialSlider testimonials={testimonials} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-conic bg-[length:200%_200%] animate-background-wave relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              style={{ opacity, scale }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[900px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up today and experience the best delivery service in Algeria.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <AnimatedButton
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 hover:shadow-neon group"
                  >
                    <span>Sign Up Now</span>
                    <motion.div
                      className="inline-block ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
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

      {/* Footer */}
      <motion.footer
        className="border-t border-gray-800 bg-gray-900 text-white"
        initial={{ backgroundColor: "#111827" }}
        whileInView={{ backgroundColor: "#0f172a" }}
        transition={{ duration: 1.5 }}
      >
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
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:shadow-neon-accent"
                >
                  <Link href="https://instagram.com" className="text-gray-400 hover:text-accent">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:shadow-neon-accent"
                >
                  <Link href="https://linkedin.com" className="text-gray-400 hover:text-primary">
                    <Linkedin className="h-5 w-5" />
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
      </motion.footer>
    </div>
  )
}

const testimonials = [
  {
    content: "SpeedBox has revolutionized how I send packages. The real-time tracking feature gives me peace of mind.",
    name: "Ahmed Benali",
    location: "Algiers",
  },
  {
    content:
      "I've been using SpeedBox for my business deliveries for 6 months now. Their service is reliable and fast.",
    name: "Samira Hadj",
    location: "Oran",
  },
  {
    content: "The customer service is exceptional. They helped me track a lost package and resolved the issue quickly.",
    name: "Karim Mezouar",
    location: "Constantine",
  },
]
