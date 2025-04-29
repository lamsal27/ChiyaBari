"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ExternalLink, X, Edit, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { BookmarksByCategory, Bookmark } from "@/app/api/bookmarks/route"
import { addBookmark, deleteBookmark, getBookmarks, updateBookmark } from "@/lib/actions"

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarksByCategory>({
    youtube: [],
    study: [],
    fun: [],
    projects: [],
  })
  const [newBookmark, setNewBookmark] = useState({ title: "", url: "", icon: "🔖", category: "youtube" })
  const [editingBookmark, setEditingBookmark] = useState<null | {
    id: string
    title: string
    url: string
    icon: string
    category: string
  }>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load bookmarks from server on component mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const fetchedBookmarks = await getBookmarks()
        setBookmarks(fetchedBookmarks)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load bookmarks. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarks()
  }, [toast])

  const handleAddBookmark = async () => {
    if (!newBookmark.title || !newBookmark.url) return

    try {
      // Optimistic update
      const tempId = Date.now().toString()
      const tempBookmark: Bookmark = {
        id: tempId,
        title: newBookmark.title,
        url: newBookmark.url,
        icon: newBookmark.icon,
      }

      setBookmarks((prev) => {
        const updatedBookmarks = { ...prev }
        if (!updatedBookmarks[newBookmark.category]) {
          updatedBookmarks[newBookmark.category] = []
        }
        updatedBookmarks[newBookmark.category] = [...updatedBookmarks[newBookmark.category], tempBookmark]
        return updatedBookmarks
      })

      setNewBookmark({ title: "", url: "", icon: "🔖", category: "youtube" })

      // Server update
      const savedBookmark = await addBookmark(
        newBookmark.title,
        newBookmark.url,
        newBookmark.icon,
        newBookmark.category,
      )

      // Update with server data
      setBookmarks((prev) => {
        const updatedBookmarks = { ...prev }
        updatedBookmarks[newBookmark.category] = updatedBookmarks[newBookmark.category].map((bookmark) =>
          bookmark.id === tempId ? savedBookmark : bookmark,
        )
        return updatedBookmarks
      })

      toast({
        title: "Success",
        description: "Bookmark added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add bookmark. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBookmark = async (id: string, category: string) => {
    try {
      // Optimistic update
      const previousBookmarks = { ...bookmarks }
      setBookmarks((prev) => {
        const updatedBookmarks = { ...prev }
        updatedBookmarks[category] = updatedBookmarks[category].filter((bookmark) => bookmark.id !== id)
        return updatedBookmarks
      })

      // Server update
      const result = await deleteBookmark(id, category)

      if (!result.success) {
        // Revert if failed
        setBookmarks(previousBookmarks)
        throw new Error("Failed to delete bookmark")
      }

      toast({
        title: "Success",
        description: "Bookmark deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bookmark. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBookmark = async () => {
    if (!editingBookmark) return

    try {
      // Optimistic update
      const previousBookmarks = { ...bookmarks }
      setBookmarks((prev) => {
        const updatedBookmarks = { ...prev }
        updatedBookmarks[editingBookmark.category] = updatedBookmarks[editingBookmark.category].map((bookmark) =>
          bookmark.id === editingBookmark.id
            ? {
                id: editingBookmark.id,
                title: editingBookmark.title,
                url: editingBookmark.url,
                icon: editingBookmark.icon,
              }
            : bookmark,
        )
        return updatedBookmarks
      })

      // Server update
      const updatedBookmark = await updateBookmark(editingBookmark.id, editingBookmark.category, {
        title: editingBookmark.title,
        url: editingBookmark.url,
        icon: editingBookmark.icon,
      })

      if (!updatedBookmark) {
        // Revert if failed
        setBookmarks(previousBookmarks)
        throw new Error("Failed to update bookmark")
      }

      toast({
        title: "Success",
        description: "Bookmark updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEditingBookmark(null)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-white">Bookmarks</h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-white">Loading bookmarks...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-white">Bookmarks</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Add New Bookmark</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={newBookmark.icon}
                  onChange={(e) => setNewBookmark({ ...newBookmark, icon: e.target.value })}
                  className="bg-white/10 border-white/20"
                  placeholder="Use an emoji as icon"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBookmark.category}
                  onValueChange={(value) => setNewBookmark({ ...newBookmark, category: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="fun">Fun</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddBookmark}>Add Bookmark</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="bg-black/30 mb-6">
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="fun">Fun</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {Object.entries(bookmarks).map(([category, items]) => (
          <TabsContent key={category} value={category} className="mt-0">
            {items.length === 0 ? (
              <div className="text-center py-10 text-white/70">
                <p>No bookmarks in this category yet.</p>
                <p className="text-sm">Add your first bookmark to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((bookmark) => (
                  <Card key={bookmark.id} className="bg-white/10 border-white/20 overflow-hidden group">
                    <CardContent className="p-4 flex items-center">
                      <div className="text-2xl mr-3">{bookmark.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{bookmark.title}</h3>
                        <p className="text-white/60 text-sm truncate">{bookmark.url}</p>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() =>
                            setEditingBookmark({
                              id: bookmark.id,
                              title: bookmark.title,
                              url: bookmark.url,
                              icon: bookmark.icon,
                              category,
                            })
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => handleDeleteBookmark(bookmark.id, category)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                          asChild
                        >
                          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Bookmark Dialog */}
      {editingBookmark && (
        <Dialog open={!!editingBookmark} onOpenChange={(open) => !open && setEditingBookmark(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Edit Bookmark</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingBookmark.title}
                  onChange={(e) => setEditingBookmark({ ...editingBookmark, title: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={editingBookmark.url}
                  onChange={(e) => setEditingBookmark({ ...editingBookmark, url: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-icon">Icon</Label>
                <Input
                  id="edit-icon"
                  value={editingBookmark.icon}
                  onChange={(e) => setEditingBookmark({ ...editingBookmark, icon: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={() => setEditingBookmark(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateBookmark}>
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
