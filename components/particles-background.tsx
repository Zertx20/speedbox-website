"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
  alpha: number
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        initParticles()
      }
    }

    // Track mouse position with throttling
    let lastMoveTime = 0
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMoveTime > 50) {
        // Throttle to 50ms
        mousePosition.current = {
          x: e.clientX,
          y: e.clientY,
        }
        lastMoveTime = now
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles.current = []
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 100)

      const colors = [
        "rgba(102, 194, 255, 0.6)", // Soft Aqua
        "rgba(255, 122, 90, 0.5)", // Coral
        "rgba(76, 175, 80, 0.4)", // Green
        "rgba(156, 39, 176, 0.3)", // Purple
        "rgba(255, 193, 7, 0.4)", // Amber
      ]

      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random() * 0.6 + 0.1,
        })
      }
    }

    // Animation loop with requestAnimationFrame
    let animationFrameId: number
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current.forEach((particle) => {
        // Move particles
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Interact with mouse
        const dx = mousePosition.current.x - particle.x
        const dy = mousePosition.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const angle = Math.atan2(dy, dx)
          particle.vx -= Math.cos(angle) * 0.02
          particle.vy -= Math.sin(angle) * 0.02
        }

        // Keep velocity in bounds
        particle.vx = Math.max(Math.min(particle.vx, 2), -2)
        particle.vy = Math.max(Math.min(particle.vy, 2), -2)

        // Draw particle
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Add event listeners with debouncing for resize
    let resizeTimeout: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }

    window.addEventListener("resize", debouncedResize)
    window.addEventListener("mousemove", handleMouseMove)

    handleResize()
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", debouncedResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.7 }} />
}
