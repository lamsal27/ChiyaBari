"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ZenModeProps {
  onExit: () => void
}

export default function ZenMode({ onExit }: ZenModeProps) {
  const [showControls, setShowControls] = useState(false)
  const [quote, setQuote] = useState("")
  const [breathingState, setBreathingState] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(4)

  // Zen mode quotes
  const zenQuotes = [
    "Breathe in peace, breathe out tension.",
    "Be still. The world will continue without you for a moment.",
    "The quieter you become, the more you can hear.",
    "Silence is the language of the universe.",
    "In stillness, find your true self.",
    "Let go of what no longer serves you.",
    "The present moment is all we ever have.",
    "Peace comes from within.",
    "Inhale the future, exhale the past.",
    "In the midst of movement and chaos, keep stillness inside of you.",
  ]

  useEffect(() => {
    // Set random zen quote
    setQuote(zenQuotes[Math.floor(Math.random() * zenQuotes.length)])

    // Show controls briefly when first entering zen mode
    setShowControls(true)
    const timer = setTimeout(() => setShowControls(false), 3000)

    // Set up breathing animation cycle
    const breathingCycle = setInterval(() => {
      setBreathingState((prev) => {
        if (prev === "inhale") return "hold"
        if (prev === "hold") return "exhale"
        return "inhale"
      })
    }, 4000) // 4 seconds per state

    // Set up breathing count
    const countInterval = setInterval(() => {
      if (breathingState === "inhale") {
        setBreathingCount((prev) => (prev > 1 ? prev - 1 : 4))
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(breathingCycle)
      clearInterval(countInterval)
    }
  }, [breathingState])

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      onMouseMove={() => {
        setShowControls(true)
        const timer = setTimeout(() => setShowControls(false), 3000)
        return () => clearTimeout(timer)
      }}
    >
      <div
        className={`absolute top-4 right-4 transition-opacity duration-500 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 text-white"
          onClick={onExit}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Exit Zen Mode</span>
        </Button>
      </div>

      <div className="text-center px-4 max-w-md">
        <p className="text-white/90 text-xl font-serif mb-12">{quote}</p>

        <div className="relative flex items-center justify-center mb-8">
          <div
            className={`w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-4000 ${
              breathingState === "inhale" ? "scale-100" : breathingState === "hold" ? "scale-125" : "scale-100"
            }`}
          >
            <div
              className={`absolute inset-0 rounded-full bg-white/10 transition-opacity duration-4000 ${
                breathingState === "hold" ? "opacity-50" : "opacity-20"
              }`}
            ></div>
            <span className="text-white text-4xl relative">{breathingCount}</span>
          </div>
        </div>

        <p className="text-white/70 text-lg">
          {breathingState === "inhale" ? "Breathe in..." : breathingState === "hold" ? "Hold..." : "Breathe out..."}
        </p>
      </div>
    </div>
  )
}
