"use client"

import { motion } from "framer-motion"
import { Package, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

export function DeliveryPathAnimation() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Calculate the position of the package along the path
  const pathLength = 100
  const packagePosition = progress / 100

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-6">
      {/* Path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
        {/* Dashed path line */}
        <motion.path
          d="M 10,50 C 40,10 80,90 120,50 C 160,10 200,90 240,50 C 280,10 320,90 390,50"
          fill="transparent"
          stroke="rgba(102, 194, 255, 0.3)"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Solid path line */}
        <motion.path
          d="M 10,50 C 40,10 80,90 120,50 C 160,10 200,90 240,50 C 280,10 320,90 390,50"
          fill="transparent"
          stroke="#66C2FF"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: packagePosition }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </svg>

      {/* Start point */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Package className="h-4 w-4" />
        </motion.div>
      </div>

      {/* End point */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        >
          <MapPin className="h-4 w-4" />
        </motion.div>
      </div>

      {/* Moving package */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 z-20"
        style={{
          left: `calc(${packagePosition * 100}% - 16px)`,
          pathOffset: packagePosition,
        }}
      >
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Package className="h-4 w-4 text-primary" />
        </motion.div>
      </motion.div>

      {/* Status text */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-white text-sm font-medium">
        {progress < 33
          ? "Preparing Package"
          : progress < 66
            ? "In Transit"
            : progress < 100
              ? "Almost There"
              : "Delivered"}
      </div>
    </div>
  )
}
