"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"

// Sample playlist
const playlist = [
  {
    id: "1",
    title: "Gentle Rain",
    artist: "Nature Sounds",
    duration: "3:45",
    cover: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    title: "Forest Morning",
    artist: "Ambient Vibes",
    duration: "4:20",
    cover: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "3",
    title: "Tea Ceremony",
    artist: "Zen Garden",
    duration: "5:12",
    cover: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    title: "Mountain Stream",
    artist: "Nature Sounds",
    duration: "3:30",
    cover: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "5",
    title: "Peaceful Piano",
    artist: "Relaxing Keys",
    duration: "4:05",
    cover: "/placeholder.svg?height=300&width=300",
  },
]

export default function Vibes() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(playlist[0])
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  // Simulate progress bar movement when playing
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext()
            return 0
          }
          return prev + 0.5
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentTrack(playlist[nextIndex])
    setProgress(0)
  }

  const handlePrev = () => {
    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
    setCurrentTrack(playlist[prevIndex])
    setProgress(0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const selectTrack = (track: (typeof playlist)[0]) => {
    setCurrentTrack(track)
    setProgress(0)
    setIsPlaying(true)
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-white">Vibes</h2>
        <p className="text-white/70">Ambient sounds to set the mood</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/10 border-white/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Now Playing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 mb-4 relative overflow-hidden rounded-md">
                <img
                  src={currentTrack.cover || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? "scale-110" : ""}`}
                />
              </div>

              <h3 className="text-white font-medium text-lg">{currentTrack.title}</h3>
              <p className="text-white/70 mb-4">{currentTrack.artist}</p>

              <div className="w-full mb-4">
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-white/60 text-xs mt-1">
                  <span>
                    {Math.floor(
                      (progress / 100) * Number.parseInt(currentTrack.duration.split(":")[0]) * 60 +
                        Number.parseInt(currentTrack.duration.split(":")[1]),
                    )
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor(
                      ((progress / 100) * Number.parseInt(currentTrack.duration.split(":")[0]) * 60 +
                        Number.parseInt(currentTrack.duration.split(":")[1])) %
                        60,
                    )
                      .toString()
                      .padStart(2, "0")}
                  </span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-white/70 hover:text-white hover:bg-white/10 ${isShuffle ? "text-amber-500" : ""}`}
                  onClick={() => setIsShuffle(!isShuffle)}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={handlePrev}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={handleNext}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-white/70 hover:text-white hover:bg-white/10 ${isRepeat ? "text-amber-500" : ""}`}
                  onClick={() => setIsRepeat(!isRepeat)}
                >
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center mt-4 w-full max-w-xs">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-full ml-2">
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
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {playlist.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                    currentTrack.id === track.id ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                  onClick={() => selectTrack(track)}
                >
                  <div className="w-10 h-10 mr-3 relative overflow-hidden rounded">
                    <img
                      src={track.cover || "/placeholder.svg"}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    {currentTrack.id === track.id && isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{track.title}</h4>
                    <p className="text-white/60 text-sm truncate">{track.artist}</p>
                  </div>
                  <div className="text-white/60 text-sm">{track.duration}</div>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs mt-4 text-center">
              Note: Audio playback is simulated in this demo. In a real implementation, audio files would play.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
