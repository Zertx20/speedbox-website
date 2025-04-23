"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AnimatedButton } from "@/components/animated-button"
import { FadeInSection } from "@/components/fade-in-section"
import { ParticlesBackground } from "@/components/particles-background"
import { ScrollProgress } from "@/components/scroll-progress"

export default function FAQPage() {
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
            <Link href="/faq" className="text-sm font-medium transition-colors hover:text-primary relative group">
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
                    Frequently Asked Questions
                  </h1>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Find answers to common questions about SpeedBox services
                  </p>
                </div>
              </div>
            </FadeInSection>
            <div className="mx-auto max-w-3xl space-y-8 py-12">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                    <AccordionTrigger className="text-gray-200 hover:text-primary">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-300">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <FadeInSection>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Still Have Questions?
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our support team is here to help
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/contact">
                    <AnimatedButton
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white"
                    >
                      Contact Us
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </FadeInSection>
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

const faqItems = [
  {
    question: "How do I sign up for SpeedBox?",
    answer:
      "You can sign up by clicking the 'Sign Up' button on our homepage and filling out the registration form with your personal details. After signing up, you'll need to visit one of our physical agencies with your ID to verify your identity before you can use our services.",
  },
  {
    question: "How does package tracking work?",
    answer:
      "Once you've shipped a package with us, you'll receive a unique tracking ID. You can enter this ID on our website or app to see real-time updates on your package's location and estimated delivery time. Our tracking system updates every step of the delivery process.",
  },
  {
    question: "What areas do you serve in Algeria?",
    answer:
      "We currently serve all major cities in Algeria including Algiers, Oran, Constantine, Annaba, and surrounding areas. We're continuously expanding our coverage to reach more locations across the country.",
  },
  {
    question: "How do I verify my identity?",
    answer:
      "After creating an account, you need to visit one of our physical agencies with a valid government-issued ID (such as a national ID card or passport). Our staff will verify your identity and activate your account for full service access.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including cash on delivery, credit/debit cards, and bank transfers. All online payments are processed through our secure payment gateway to ensure your financial information is protected.",
  },
  {
    question: "How long does delivery typically take?",
    answer:
      "Delivery times vary depending on the distance and destination. For local deliveries within the same city, we typically deliver within 24-48 hours. For intercity deliveries, it usually takes 2-4 business days. You can always check the estimated delivery time when placing your order.",
  },
  {
    question: "What happens if my package is lost or damaged?",
    answer:
      "We take great care to ensure all packages are delivered safely. However, in the rare event that a package is lost or damaged, please contact our customer support team immediately. We offer insurance coverage for all shipments and will process your claim according to our terms of service.",
  },
  {
    question: "Can I schedule a specific delivery time?",
    answer:
      "Yes, we offer scheduled delivery options for an additional fee. You can select a preferred delivery window when placing your order, and our team will do their best to accommodate your request.",
  },
]
