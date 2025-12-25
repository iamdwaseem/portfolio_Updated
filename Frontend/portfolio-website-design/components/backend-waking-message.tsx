"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BackendWakingMessage() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show after 3 seconds of "Static Mode"
    const timer = setTimeout(() => {
      setShow(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Alert variant="default" className="w-80 border-primary/50 shadow-xl bg-background/95 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4 text-primary animate-pulse" />
        <AlertTitle className="font-semibold text-primary">Backend Syncing...</AlertTitle>
        <AlertDescription className="text-xs opacity-90">
          Showing static data while the backend (Render/Cold Start) wakes up. Your site will refresh automatically.
        </AlertDescription>
      </Alert>
    </div>
  )
}
