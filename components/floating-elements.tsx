"use client"

import { motion } from "framer-motion"
import { Package, Truck, MapPin, Clock, CreditCard, CheckCircle } from "lucide-react"

export function FloatingElements() {
  const elements = [
    { icon: Package, color: "#66C2FF", x: "10%", y: "20%", size: 24, delay: 0 },
    { icon: Truck, color: "#FF7A5A", x: "85%", y: "15%", size: 32, delay: 1 },
    { icon: MapPin, color: "#9C27B0", x: "75%", y: "85%", size: 28, delay: 2 },
    { icon: Clock, color: "#4CAF50", x: "15%", y: "75%", size: 26, delay: 3 },
    { icon: CreditCard, color: "#FFC107", x: "50%", y: "90%", size: 30, delay: 4 },
    { icon: CheckCircle, color: "#66C2FF", x: "90%", y: "50%", size: 22, delay: 5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => {
        const Icon = element.icon
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: element.x,
              top: element.y,
              color: element.color,
            }}
            animate={{
              y: ["0%", "-15%", "0%"],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: element.delay,
            }}
          >
            <Icon size={element.size} style={{ opacity: 0.6 }} />
          </motion.div>
        )
      })}
    </div>
  )
}
