"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface AnimatedFeatureIconProps {
  icon: LucideIcon
  className?: string
}

export function AnimatedFeatureIcon({ icon: Icon, className = "" }: AnimatedFeatureIconProps) {
  return (
    <motion.div
      className={`flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ${className}`}
      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 122, 90, 0.2)" }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
        <Icon className="h-8 w-8 text-primary" />
      </motion.div>
    </motion.div>
  )
}
