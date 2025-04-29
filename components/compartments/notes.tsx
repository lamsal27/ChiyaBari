"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pin, PinOff, Save, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Note } from "@/app/api/notes/route"
import { addNote, deleteNote, getNotes, updateNote } from "@/lib/actions"

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingNote, setEditingNote] = useState<null | {
    id: string
    title: string
    content: string
    isPinned: boolean
  }>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load notes from server on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes()
        setNotes(fetchedNotes)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [toast])

  const handleAddNote = async () => {
    if (!newNote.title) return

    try {
      // Optimistic update
      const tempId = Date.now().toString()
      const tempNote: Note = {
        id: tempId,
        title: newNote.title,
        content: newNote.content,
        isPinned: false,
        lastEdited: new Date().toISOString(),
      }

      setNotes((prev) => [...prev, tempNote])
      setNewNote({ title: "", content: "" })

      // Server update
      const savedNote = await addNote(newNote.title, newNote.content)

      // Update with server data
      setNotes((prev) => prev.map((note) => (note.id === tempId ? savedNote : note)))

      toast({
        title: "Success",
        description: "Note added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      // Optimistic update
      const previousNotes = [...notes]
      setNotes((prev) => prev.filter((note) => note.id !== id))

      // Server update
      const result = await deleteNote(id)

      if (!result.success) {
        // Revert if failed
        setNotes(previousNotes)
        throw new Error("Failed to delete note")
      }

      toast({
        title: "Success",
        description: "Note deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return

    try {
      // Optimistic update
      const previousNotes = [...notes]
      setNotes((prev) => {
        return prev.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                title: editingNote.title,
                content: editingNote.content,
                lastEdited: new Date().toISOString(),
              }
            : note,
        )
      })

      // Server update
      const updatedNote = await updateNote(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
      })

      if (!updatedNote) {
        // Revert if failed
        setNotes(previousNotes)
        throw new Error("Failed to update note")
      }

      toast({
        title: "Success",
        description: "Note updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEditingNote(null)
    }
  }

  const togglePin = async (id: string) => {
    try {
      const noteToToggle = notes.find((note) => note.id === id)
      if (!noteToToggle) return

      // Optimistic update
      const previousNotes = [...notes]
      setNotes((prev) => {
        return prev.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note))
      })

      // Server update
      const updatedNote = await updateNote(id, { isPinned: !noteToToggle.isPinned })

      if (!updatedNote) {
        // Revert if failed
        setNotes(previousNotes)
        throw new Error("Failed to update note")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Sort notes: pinned first, then by last edited date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
  })

  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-white">Notes</h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-white">Loading notes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-white">Notes</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="bg-white/10 border-white/20 resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddNote}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-white/70">
            <p>No notes yet. Create your first note to get started.</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <Card
              key={note.id}
              className={`bg-white/10 border-white/20 overflow-hidden ${note.isPinned ? "border-amber-500/50" : ""}`}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-white text-lg font-medium">{note.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => togglePin(note.id)}
                  >
                    {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() =>
                      setEditingNote({
                        id: note.id,
                        title: note.title,
                        content: note.content,
                        isPinned: note.isPinned,
                      })
                    }
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-white/80 whitespace-pre-line">{note.content}</p>
                <p className="text-xs text-white/50 mt-2">
                  Last edited: {new Date(note.lastEdited).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Note Dialog */}
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  rows={6}
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="bg-white/10 border-white/20 resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={() => setEditingNote(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateNote}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
