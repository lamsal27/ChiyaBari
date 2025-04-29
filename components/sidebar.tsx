"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookMarked, FileText, Calendar, Briefcase, Coffee, ImageIcon, Music, Sparkles, Menu, X } from "lucide-react"

interface SidebarProps {
  activeCompartment: string
  onCompartmentChange: (compartment: string) => void
  zenModeActive: boolean
}

const compartments = [
  { id: "bookmarks", name: "Bookmarks", icon: BookMarked },
  { id: "notes", name: "Notes", icon: FileText },
  { id: "daily-rituals", name: "Daily Rituals", icon: Calendar },
  { id: "secret-drawers", name: "Secret Drawers", icon: Briefcase },
  { id: "chiya-corner", name: "Chiya Corner", icon: Coffee },
  { id: "memories", name: "Memories", icon: ImageIcon },
  { id: "vibes", name: "Vibes", icon: Music },
  { id: "zen-mode", name: "Zen Mode", icon: Sparkles },
]

export default function Sidebar({ activeCompartment, onCompartmentChange, zenModeActive }: SidebarProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-black/40 backdrop-blur-md text-white border-r border-white/10 w-64 flex-shrink-0 transition-all duration-300 ease-in-out",
          "fixed md:relative inset-y-0 left-0 z-40 md:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold tracking-tight mb-1">Chiya Bari</h1>
          <p className="text-sm text-white/70 mb-8">Your digital tea garden</p>

          <nav className="space-y-1">
            {compartments.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/70 hover:text-white hover:bg-white/10",
                    (activeCompartment === item.id || (item.id === "zen-mode" && zenModeActive)) &&
                      "bg-white/20 text-white",
                  )}
                  onClick={() => {
                    onCompartmentChange(item.id)
                    setIsMobileSidebarOpen(false)
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
