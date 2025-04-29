"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coffee, Cloud, CloudRain, Sun, Droplets, Wind, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"

// Sample tea types
const teaTypes = [
  { name: "Green Tea", description: "Light and refreshing with grassy notes", color: "bg-emerald-500" },
  { name: "Black Tea", description: "Bold and robust with malty flavors", color: "bg-amber-800" },
  { name: "Oolong Tea", description: "Complex with floral and fruity notes", color: "bg-amber-600" },
  { name: "White Tea", description: "Delicate and subtle with honey notes", color: "bg-amber-200" },
  { name: "Herbal Tea", description: "Caffeine-free with various flavors", color: "bg-purple-500" },
  { name: "Chai Tea", description: "Spiced and warming with aromatic spices", color: "bg-orange-600" },
]

// Sample ambient sounds
const ambientSounds = [
  { name: "Rain", icon: CloudRain },
  { name: "Forest", icon: Droplets },
  { name: "Wind Chimes", icon: Wind },
  { name: "Tea Pouring", icon: Coffee },
  { name: "Soft Piano", icon: Volume2 },
]

// Sample calming phrases
const calmingPhrases = [
  "Take a deep breath and enjoy this moment.",
  "Let your worries steep away with your tea.",
  "Find peace in the simple ritual of tea making.",
  "The present moment is a gift. That's why it's called the present.",
  "Sip slowly, breathe deeply.",
  "Tea is the quiet moment in a busy day.",
  "Let go of what you cannot change.",
  "The path to peace is paved with small moments of joy.",
  "In the space between thoughts, there is tranquility.",
  "Your cup is neither half-full nor half-empty; it simply is.",
]

export default function ChiyaCorner() {
  const [currentTea, setCurrentTea] = useState(teaTypes[0])
  const [currentPhrase, setCurrentPhrase] = useState("")
  const [weather, setWeather] = useState({ temp: "22°C", condition: "Sunny", icon: Sun })
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    // Set random calming phrase
    setCurrentPhrase(calmingPhrases[Math.floor(Math.random() * calmingPhrases.length)])

    // Simulate weather data
    const weatherConditions = [
      { temp: "22°C", condition: "Sunny", icon: Sun },
      { temp: "18°C", condition: "Cloudy", icon: Cloud },
      { temp: "15°C", condition: "Rainy", icon: CloudRain },
    ]
    setWeather(weatherConditions[Math.floor(Math.random() * weatherConditions.length)])

    // Change phrase every 20 seconds
    const phraseInterval = setInterval(() => {
      let newPhrase = currentPhrase
      while (newPhrase === currentPhrase) {
        newPhrase = calmingPhrases[Math.floor(Math.random() * calmingPhrases.length)]
      }
      setCurrentPhrase(newPhrase)
    }, 20000)

    return () => clearInterval(phraseInterval)
  }, [currentPhrase])

  const changeTea = () => {
    let newTea = currentTea
    while (newTea === currentTea) {
      newTea = teaTypes[Math.floor(Math.random() * teaTypes.length)]
    }
    setCurrentTea(newTea)
  }

  const toggleSound = (soundName: string) => {
    if (activeSound === soundName) {
      setActiveSound(null)
    } else {
      setActiveSound(soundName)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-white">Chiya Corner</h2>
        <div className="flex items-center text-white">
          <div className="mr-2">{React.createElement(weather.icon, { className: "h-5 w-5" })}</div>
          <span>{weather.temp}</span>
          <span className="mx-2">•</span>
          <span>{weather.condition}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/10 border-white/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Today's Tea</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full mr-4 ${currentTea.color}`}></div>
              <div>
                <h3 className="text-white font-medium">{currentTea.name}</h3>
                <p className="text-white/70 text-sm">{currentTea.description}</p>
              </div>
            </div>
            <Button
              onClick={changeTea}
              variant="outline"
              className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Brew Another Tea
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Calming Thought</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-white/90 text-center text-lg font-serif italic">{currentPhrase}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 overflow-hidden md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex justify-between items-center">
              <span>Ambient Sounds</span>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-24 ml-2">
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                    disabled={isMuted}
                    className={isMuted ? "opacity-50" : ""}
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ambientSounds.map((sound) => {
                const Icon = sound.icon
                return (
                  <Button
                    key={sound.name}
                    variant="outline"
                    className={`bg-white/10 border-white/20 hover:bg-white/20 text-white ${
                      activeSound === sound.name ? "bg-white/30 border-amber-500" : ""
                    }`}
                    onClick={() => toggleSound(sound.name)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {sound.name}
                  </Button>
                )
              })}
            </div>
            <p className="text-white/50 text-xs mt-4 text-center">
              Note: Ambient sounds are simulated in this demo. In a real implementation, audio files would play.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
