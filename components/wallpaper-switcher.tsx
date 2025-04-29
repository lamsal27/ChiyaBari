"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Paintbrush } from "lucide-react"

const wallpapers = [
  {
    id: "tea-garden-1",
    name: "Misty Tea Garden",
    url: "/images/tea-garden-1.png",
    color: "from-emerald-900 to-emerald-700",
  },
  {
    id: "tea-garden-2",
    name: "Hillside Tea Plantation",
    url: "/images/tea-garden-2.png",
    color: "from-green-900 to-green-700",
  },
  {
    id: "tea-garden-3",
    name: "Lush Tea Fields",
    url: "/images/tea-garden-3.png",
    color: "from-emerald-800 to-emerald-600",
  },
  {
    id: "tea-garden-4",
    name: "Mountain Tea Garden",
    url: "/images/tea-garden-4.png",
    color: "from-green-800 to-green-600",
  },
]

export default function WallpaperSwitcher() {
  const [currentWallpaper, setCurrentWallpaper] = useState(wallpapers[0])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load saved wallpaper preference from localStorage if available
    const savedWallpaper = localStorage.getItem("chiyaBariWallpaper")
    if (savedWallpaper) {
      const wallpaper = wallpapers.find((w) => w.id === savedWallpaper)
      if (wallpaper) setCurrentWallpaper(wallpaper)
    }

    // Add a small delay to allow for a smooth fade-in effect
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const changeWallpaper = (wallpaper: (typeof wallpapers)[0]) => {
    setCurrentWallpaper(wallpaper)
    localStorage.setItem("chiyaBariWallpaper", wallpaper.id)
  }

  return (
    <>
      {/* Gradient overlay for better text readability */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${currentWallpaper.color} opacity-60 z-0`}
        aria-hidden="true"
      />

      {/* Wallpaper image */}
      <div
        className={`absolute inset-0 bg-cover bg-center z-[-1] transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundImage: `url(${currentWallpaper.url})` }}
        aria-hidden="true"
      />

      {/* Wallpaper switcher button */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30"
            >
              <Paintbrush className="h-4 w-4" />
              <span className="sr-only">Change wallpaper</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/70 backdrop-blur-md border-white/20 text-white">
            {wallpapers.map((wallpaper) => (
              <DropdownMenuItem
                key={wallpaper.id}
                onClick={() => changeWallpaper(wallpaper)}
                className={`cursor-pointer ${currentWallpaper.id === wallpaper.id ? "bg-white/20" : "hover:bg-white/10"}`}
              >
                {wallpaper.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
