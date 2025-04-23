"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useInView } from "react-intersection-observer"

interface StepAnimationProps {
  children: ReactNode
  step: number
  title: string
  description: string
}

export function StepAnimation({ children, step, title, description }: StepAnimationProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const variants = {
    hidden: { opacity: 0, x: step % 2 === 0 ? 50 : -50 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, delay: step * 0.2 }}
      className="flex flex-col items-center space-y-4 rounded-lg border p-6"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        {children}
      </motion.div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-center text-muted-foreground">{description}</p>
    </motion.div>
  )
}
