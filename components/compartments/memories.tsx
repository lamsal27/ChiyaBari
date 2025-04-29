"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample memories/gallery items
const galleryItems = [
  {
    id: "1",
    title: "Misty Tea Garden",
    description: "Morning fog over the tea plantation creates a mystical atmosphere",
    image: "/images/tea-garden-1.png",
  },
  {
    id: "2",
    title: "Hillside Tea Plantation",
    description: "Rows of tea plants stretching across the rolling hills",
    image: "/images/tea-garden-2.png",
  },
  {
    id: "3",
    title: "Lush Tea Fields",
    description: "Vibrant green tea fields under a clear blue sky",
    image: "/images/tea-garden-3.png",
  },
  {
    id: "4",
    title: "Mountain Tea Garden",
    description: "Tea plantation nestled between majestic mountains",
    image: "/images/tea-garden-4.png",
  },
  {
    id: "5",
    title: "Tea Harvest",
    description: "The careful process of harvesting premium tea leaves",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "6",
    title: "Tea Ceremony",
    description: "The ancient art of preparing and serving tea",
    image: "/placeholder.svg?height=600&width=800",
  },
]

export default function Memories() {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-white">Memories</h2>
        <p className="text-white/70">A collection of peaceful moments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <Card
            key={item.id}
            className="bg-white/10 border-white/20 overflow-hidden cursor-pointer group"
            onClick={() => setSelectedImage(item)}
          >
            <CardContent className="p-0 relative">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={400}
                height={300}
                className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Viewer Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="bg-black/90 backdrop-blur-md border-white/20 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedImage.title}</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image
                src={selectedImage.image || "/placeholder.svg"}
                alt={selectedImage.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-white/80">{selectedImage.description}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
