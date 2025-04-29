"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Lock, Unlock, Eye, EyeOff, Save, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { Secret } from "@/app/api/secrets/route"
import { addSecret, deleteSecret, getSecrets, updateSecret } from "@/lib/actions"

export default function SecretDrawers() {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [newSecret, setNewSecret] = useState({ title: "", content: "" })
  const [editingSecret, setEditingSecret] = useState<null | {
    id: string
    title: string
    content: string
    isLocked: boolean
  }>(null)
  const [visibleSecrets, setVisibleSecrets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load secrets from server on component mount
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const fetchedSecrets = await getSecrets()
        setSecrets(fetchedSecrets)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load secrets. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSecrets()
  }, [toast])

  const handleAddSecret = async () => {
    if (!newSecret.title) return

    try {
      // Optimistic update
      const tempId = Date.now().toString()
      const tempSecret: Secret = {
        id: tempId,
        title: newSecret.title,
        content: newSecret.content,
        isLocked: false,
      }

      setSecrets((prev) => [...prev, tempSecret])
      setNewSecret({ title: "", content: "" })

      // Server update
      const savedSecret = await addSecret(newSecret.title, newSecret.content)

      // Update with server data
      setSecrets((prev) => prev.map((secret) => (secret.id === tempId ? savedSecret : secret)))

      toast({
        title: "Success",
        description: "Secret added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add secret. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSecret = async (id: string) => {
    try {
      // Optimistic update
      const previousSecrets = [...secrets]
      setSecrets((prev) => prev.filter((secret) => secret.id !== id))
      setVisibleSecrets((prev) => prev.filter((secretId) => secretId !== id))

      // Server update
      const result = await deleteSecret(id)

      if (!result.success) {
        // Revert if failed
        setSecrets(previousSecrets)
        throw new Error("Failed to delete secret")
      }

      toast({
        title: "Success",
        description: "Secret deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete secret. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSecret = async () => {
    if (!editingSecret) return

    try {
      // Optimistic update
      const previousSecrets = [...secrets]
      setSecrets((prev) => {
        return prev.map((secret) =>
          secret.id === editingSecret.id
            ? {
                ...secret,
                title: editingSecret.title,
                content: editingSecret.content,
              }
            : secret,
        )
      })

      // Server update
      const updatedSecret = await updateSecret(editingSecret.id, {
        title: editingSecret.title,
        content: editingSecret.content,
      })

      if (!updatedSecret) {
        // Revert if failed
        setSecrets(previousSecrets)
        throw new Error("Failed to update secret")
      }

      toast({
        title: "Success",
        description: "Secret updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update secret. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEditingSecret(null)
    }
  }

  const toggleLock = async (id: string) => {
    try {
      const secretToToggle = secrets.find((secret) => secret.id === id)
      if (!secretToToggle) return

      // Optimistic update
      const previousSecrets = [...secrets]
      setSecrets((prev) => {
        return prev.map((secret) => (secret.id === id ? { ...secret, isLocked: !secret.isLocked } : secret))
      })

      // If locking, remove from visible secrets
      if (!secretToToggle.isLocked) {
        setVisibleSecrets((prev) => prev.filter((secretId) => secretId !== id))
      }

      // Server update
      const updatedSecret = await updateSecret(id, { isLocked: !secretToToggle.isLocked })

      if (!updatedSecret) {
        // Revert if failed
        setSecrets(previousSecrets)
        throw new Error("Failed to update secret")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update secret. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleVisibility = (id: string) => {
    setVisibleSecrets((prev) => (prev.includes(id) ? prev.filter((secretId) => secretId !== id) : [...prev, id]))
  }

  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-white">Secret Drawers</h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-white">Loading secrets...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-white">Secret Drawers</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Secret
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Create New Secret</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newSecret.title}
                  onChange={(e) => setNewSecret({ ...newSecret, title: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={newSecret.content}
                  onChange={(e) => setNewSecret({ ...newSecret, content: e.target.value })}
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
                <Button onClick={handleAddSecret}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Secret
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secrets.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-white/70">
            <p>No secrets yet. Create your first secret to get started.</p>
          </div>
        ) : (
          secrets.map((secret) => (
            <Card
              key={secret.id}
              className={`bg-white/10 border-white/20 overflow-hidden ${secret.isLocked ? "border-amber-500/50" : ""}`}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-white text-lg font-medium">{secret.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => toggleLock(secret.id)}
                  >
                    {secret.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                  {!secret.isLocked && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => toggleVisibility(secret.id)}
                      >
                        {visibleSecrets.includes(secret.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() =>
                          setEditingSecret({
                            id: secret.id,
                            title: secret.title,
                            content: secret.content,
                            isLocked: secret.isLocked,
                          })
                        }
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleDeleteSecret(secret.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {secret.isLocked ? (
                  <div className="flex flex-col items-center justify-center py-4 text-white/60">
                    <Lock className="h-8 w-8 mb-2" />
                    <p>This content is locked</p>
                  </div>
                ) : (
                  <div
                    className={`transition-opacity duration-300 ${visibleSecrets.includes(secret.id) ? "opacity-100" : "opacity-0"}`}
                  >
                    {visibleSecrets.includes(secret.id) ? (
                      <p className="text-white/80 whitespace-pre-line">{secret.content}</p>
                    ) : (
                      <div className="flex items-center justify-center py-4 text-white/60">
                        <p>Click the eye icon to view</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Secret Dialog */}
      {editingSecret && (
        <Dialog open={!!editingSecret} onOpenChange={(open) => !open && setEditingSecret(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Edit Secret</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingSecret.title}
                  onChange={(e) => setEditingSecret({ ...editingSecret, title: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  rows={6}
                  value={editingSecret.content}
                  onChange={(e) => setEditingSecret({ ...editingSecret, content: e.target.value })}
                  className="bg-white/10 border-white/20 resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={() => setEditingSecret(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateSecret}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
