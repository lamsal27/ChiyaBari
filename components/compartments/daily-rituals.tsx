"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, RefreshCw, Quote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/app/api/rituals/route"
import { addTask, deleteTask, getTasks, updateTask } from "@/lib/actions"

// Sample quotes
const quotes = [
  "The path to inner peace begins with a cup of tea.",
  "Life is like tea, it's all in how you make it.",
  "There is something in the nature of tea that leads us into a world of quiet contemplation.",
  "Tea is quiet and our thirst for tea is never far from our craving for beauty.",
  "Each cup of tea represents an imaginary voyage.",
  "A cup of tea is a cup of peace.",
  "Tea is the elixir of life.",
  "The first cup moistens my lips and throat, the second cup breaks my loneliness.",
  "Tea is liquid wisdom.",
  "There is no trouble so great that cannot be diminished by a nice cup of tea.",
]

export default function DailyRituals() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [quote, setQuote] = useState("")
  const [date, setDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Set random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])

    // Set current date
    const today = new Date()
    setDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    // Load tasks from server
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [toast])

  const handleAddTask = async () => {
    if (!newTask.trim()) return

    try {
      // Optimistic update
      const tempId = Date.now().toString()
      const tempTask: Task = {
        id: tempId,
        text: newTask,
        completed: false,
      }

      setTasks((prev) => [...prev, tempTask])
      setNewTask("")

      // Server update
      const savedTask = await addTask(newTask)

      // Update with server data
      setTasks((prev) => prev.map((task) => (task.id === tempId ? savedTask : task)))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleTask = async (id: string) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id)
      if (!taskToToggle) return

      // Optimistic update
      const previousTasks = [...tasks]
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))

      // Server update
      const updatedTask = await updateTask(id, { completed: !taskToToggle.completed })

      if (!updatedTask) {
        // Revert if failed
        setTasks(previousTasks)
        throw new Error("Failed to update task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTaskHandler = async (id: string) => {
    try {
      // Optimistic update
      const previousTasks = [...tasks]
      setTasks((prev) => prev.filter((task) => task.id !== id))

      // Server update
      const result = await deleteTask(id)

      if (!result.success) {
        // Revert if failed
        setTasks(previousTasks)
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const refreshQuote = () => {
    let newQuote = quote
    while (newQuote === quote) {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)]
    }
    setQuote(newQuote)
  }

  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-white">Daily Rituals</h2>
          <p className="text-white/70 text-sm">{date}</p>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-white">Loading rituals...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-white">Daily Rituals</h2>
        <p className="text-white/70 text-sm">{date}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card className="bg-white/10 border-white/20 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center justify-between">
                <span>Daily Quote</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={refreshQuote}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex">
                <Quote className="h-8 w-8 text-amber-500/70 mr-2 flex-shrink-0" />
                <p className="text-white/80 italic">{quote}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Add a new ritual..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="bg-white/10 border-white/20 text-white"
            />
            <Button
              onClick={handleAddTask}
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-6 text-white/50">
              <p>No rituals added yet.</p>
              <p className="text-sm">Add your daily practices above.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                  task.completed ? "bg-white/5" : "bg-white/10"
                }`}
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="border-white/30 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label
                  htmlFor={`task-${task.id}`}
                  className={`flex-1 text-white ${task.completed ? "line-through text-white/50" : ""}`}
                >
                  {task.text}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTaskHandler(task.id)}
                  className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
                >
                  ×
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
