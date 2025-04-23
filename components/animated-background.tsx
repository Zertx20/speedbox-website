"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedBackgroundProps {
  children: ReactNode
}

export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-wave bg-[length:400%_400%] opacity-30"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
