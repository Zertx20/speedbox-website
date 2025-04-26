"use client"

import type React from "react"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useRef, useState } from "react"

export function Package3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  // Update the handleMouseMove function to improve tracking
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate distance from center with a multiplier for more pronounced effect
    const multiplier = 0.5
    x.set((event.clientX - centerX) * multiplier)
    y.set((event.clientY - centerY) * multiplier)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-64 perspective-1000 mx-auto cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        style={{
          rotateX,
          rotateY,
          transition: isHovered ? "none" : "all 0.5s ease",
        }}
      >
        {/* Front face - Package image */}
        <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden">
          <img
            src="/logo3.png"
            alt="SpeedBox Package"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Back face - Logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg flex items-center justify-center backface-hidden rotate-y-180">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <img
              src="/logo3.png"
              alt="SpeedBox Logo"
              className="w-3/4 h-3/4 object-contain mb-2"
            />
            <span className="text-white text-xl font-bold">SpeedBox</span>
          </div>
        </div>

        {/* Top face */}
        <div className="absolute w-full h-[10px] bg-gradient-to-r from-gray-600/40 to-gray-800/40 origin-top transform -translate-z-[5px] rotate-x-90 top-0 rounded-t-lg"></div>

        {/* Bottom face */}
        <div className="absolute w-full h-[10px] bg-gradient-to-r from-gray-800/40 to-gray-900/40 origin-bottom transform -translate-z-[5px] -rotate-x-90 bottom-0 rounded-b-lg"></div>

        {/* Left face */}
        <div className="absolute h-full w-[10px] bg-gradient-to-b from-gray-700/40 to-gray-800/40 origin-left transform -translate-x-[5px] rotate-y-90 left-0 rounded-l-lg"></div>

        {/* Right face */}
        <div className="absolute h-full w-[10px] bg-gradient-to-b from-gray-700/40 to-gray-800/40 origin-right transform translate-x-[5px] -rotate-y-90 right-0 rounded-r-lg"></div>
      </motion.div>

      {/* Enhanced shadow with animation */}
      <motion.div
        className="absolute bottom-[-20px] left-0 right-0 h-4 bg-black/20 rounded-full blur-md mx-auto"
        style={{ width: "80%" }}
        animate={{
          width: isHovered ? "70%" : "80%",
          opacity: isHovered ? 0.3 : 0.2,
        }}
      />
    </div>
  )
}
