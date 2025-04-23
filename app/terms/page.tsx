"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package } from "lucide-react"
import { AnimatedButton } from "@/components/animated-button"
import { FadeInSection } from "@/components/fade-in-section"
import { ParticlesBackground } from "@/components/particles-background"
import { ScrollProgress } from "@/components/scroll-progress"

export default function TermsPage() {
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
            <div className="mx-auto max-w-3xl space-y-8">
              <FadeInSection>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Terms of Service
                  </h1>
                  <p className="text-gray-300">Last updated: April 22, 2023</p>
                </div>
              </FadeInSection>

              <div className="space-y-6">
                <FadeInSection delay={0.1}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                    <p className="text-gray-300">
                      Welcome to SpeedBox ("Company", "we", "our", "us"). These Terms of Service govern your use of our
                      website and services. By accessing or using our services, you agree to be bound by these Terms.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.2}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">2. Account Registration and Verification</h2>
                    <p className="text-gray-300">
                      To use our services, you must create an account and provide accurate information. After
                      registration, you must visit one of our physical agencies with a valid government-issued ID to
                      verify your identity. Until your identity is verified, you will not be able to use our delivery
                      services.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.3}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">3. Service Description</h2>
                    <p className="text-gray-300">
                      SpeedBox provides package delivery services across Algeria. We offer real-time tracking, secure
                      payments, and various delivery options. Delivery times and availability may vary depending on your
                      location and the destination of your package.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.4}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">4. User Responsibilities</h2>
                    <p className="text-gray-300">You are responsible for:</p>
                    <ul className="list-disc pl-6 text-gray-300">
                      <li>Providing accurate information about yourself and your packages</li>
                      <li>
                        Ensuring that the contents of your packages comply with all applicable laws and regulations
                      </li>
                      <li>
                        Not sending prohibited items (including but not limited to illegal substances, dangerous goods,
                        or perishable items without proper packaging)
                      </li>
                      <li>Maintaining the confidentiality of your account credentials</li>
                      <li>Promptly reporting any unauthorized use of your account</li>
                    </ul>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.5}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">5. Payments and Fees</h2>
                    <p className="text-gray-300">
                      Our fees are based on package size, weight, destination, and delivery speed. All fees will be
                      clearly displayed before you confirm your order. We accept various payment methods, including cash
                      on delivery, credit/debit cards, and bank transfers. All online payments are processed through
                      secure payment gateways.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.6}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">6. Package Insurance and Liability</h2>
                    <p className="text-gray-300">
                      All packages are insured up to a certain value. If your package is lost or damaged during transit,
                      you may be eligible for compensation according to our insurance policy. Claims must be filed
                      within 7 days of the scheduled delivery date. Our liability is limited to the declared value of
                      the package or the maximum insurance coverage, whichever is less.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.7}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">7. Privacy Policy</h2>
                    <p className="text-gray-300">
                      We collect and process personal data in accordance with our Privacy Policy. By using our services,
                      you consent to our collection and use of your data as described in the Privacy Policy.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.8}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">8. Termination</h2>
                    <p className="text-gray-300">
                      We reserve the right to suspend or terminate your account if you violate these Terms or engage in
                      fraudulent or illegal activities. You may also terminate your account at any time by contacting
                      our customer support.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.9}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">9. Changes to Terms</h2>
                    <p className="text-gray-300">
                      We may update these Terms from time to time. We will notify you of any significant changes by
                      email or through our website. Your continued use of our services after such changes constitutes
                      your acceptance of the new Terms.
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={1.0}>
                  <div className="space-y-2 bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">10. Contact Information</h2>
                    <p className="text-gray-300">If you have any questions about these Terms, please contact us at:</p>
                    <p className="text-gray-300">
                      Email: legal@speedbox.dz
                      <br />
                      Phone: +213 XX XX XX XX
                      <br />
                      Address: 123 Didouche Mourad Street, Algiers, Algeria
                    </p>
                  </div>
                </FadeInSection>
              </div>
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
