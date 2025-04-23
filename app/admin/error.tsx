// Create an error boundary component for the admin page
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-gray-300">{error.message || "An unexpected error occurred. Please try again."}</p>
        <Button onClick={reset} className="bg-gradient-to-r from-primary to-accent hover:shadow-neon text-white">
          Try again
        </Button>
      </div>
    </div>
  )
}
