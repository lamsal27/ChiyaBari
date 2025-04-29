"use client"

import WallpaperSwitcher from "@/components/wallpaper-switcher"
import Sidebar from "@/components/sidebar"
import Bookmarks from "@/components/compartments/bookmarks"
import Notes from "@/components/compartments/notes"
import DailyRituals from "@/components/compartments/daily-rituals"
import SecretDrawers from "@/components/compartments/secret-drawers"
import ChiyaCorner from "@/components/compartments/chiya-corner"
import Memories from "@/components/compartments/memories"
import Vibes from "@/components/compartments/vibes"
import ZenMode from "@/components/compartments/zen-mode"
import { useState } from "react"

export default function Home() {
  const [activeCompartment, setActiveCompartment] = useState("chiya-corner")
  const [zenModeActive, setZenModeActive] = useState(false)

  const handleCompartmentChange = (compartment: string) => {
    if (compartment === "zen-mode") {
      setZenModeActive(true)
    } else {
      setZenModeActive(false)
      setActiveCompartment(compartment)
    }
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <Sidebar
        activeCompartment={activeCompartment}
        onCompartmentChange={handleCompartmentChange}
        zenModeActive={zenModeActive}
      />
      <div className="flex-1 relative overflow-hidden">
        <WallpaperSwitcher />

        <div
          className={`absolute inset-0 overflow-auto p-4 md:p-8 transition-opacity duration-500 ${zenModeActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {activeCompartment === "bookmarks" && <Bookmarks />}
          {activeCompartment === "notes" && <Notes />}
          {activeCompartment === "daily-rituals" && <DailyRituals />}
          {activeCompartment === "secret-drawers" && <SecretDrawers />}
          {activeCompartment === "chiya-corner" && <ChiyaCorner />}
          {activeCompartment === "memories" && <Memories />}
          {activeCompartment === "vibes" && <Vibes />}
        </div>

        {zenModeActive && <ZenMode onExit={() => setZenModeActive(false)} />}
      </div>
    </main>
  )
}
