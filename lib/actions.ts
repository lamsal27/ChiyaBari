"use server"

import { readData, writeData, generateId } from "./data-service"
import { revalidatePath } from "next/cache"
import type { Note } from "@/app/api/notes/route"
import type { Task } from "@/app/api/rituals/route"
import type { Secret } from "@/app/api/secrets/route"
import type { BookmarksByCategory, Bookmark } from "@/app/api/bookmarks/route"

// Notes actions
export async function getNotes() {
  return await readData<Note[]>("notes", [])
}

export async function saveNotes(notes: Note[]) {
  await writeData("notes", notes)
  revalidatePath("/")
  return { success: true }
}

export async function addNote(title: string, content: string) {
  const notes = await getNotes()
  const newNote: Note = {
    id: generateId(),
    title,
    content,
    isPinned: false,
    lastEdited: new Date().toISOString(),
  }

  await saveNotes([...notes, newNote])
  return newNote
}

export async function updateNote(id: string, updates: Partial<Note>) {
  const notes = await getNotes()
  const updatedNotes = notes.map((note) =>
    note.id === id ? { ...note, ...updates, lastEdited: new Date().toISOString() } : note,
  )

  await saveNotes(updatedNotes)
  return updatedNotes.find((note) => note.id === id)
}

export async function deleteNote(id: string) {
  const notes = await getNotes()
  const filteredNotes = notes.filter((note) => note.id !== id)
  await saveNotes(filteredNotes)
  return { success: true }
}

// Rituals/Tasks actions
export async function getTasks() {
  return await readData<Task[]>("rituals", [])
}

export async function saveTasks(tasks: Task[]) {
  await writeData("rituals", tasks)
  revalidatePath("/")
  return { success: true }
}

export async function addTask(text: string) {
  const tasks = await getTasks()
  const newTask: Task = {
    id: generateId(),
    text,
    completed: false,
  }

  await saveTasks([...tasks, newTask])
  return newTask
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const tasks = await getTasks()
  const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))

  await saveTasks(updatedTasks)
  return updatedTasks.find((task) => task.id === id)
}

export async function deleteTask(id: string) {
  const tasks = await getTasks()
  const filteredTasks = tasks.filter((task) => task.id !== id)
  await saveTasks(filteredTasks)
  return { success: true }
}

// Secrets/Drawers actions
export async function getSecrets() {
  return await readData<Secret[]>("secrets", [])
}

export async function saveSecrets(secrets: Secret[]) {
  await writeData("secrets", secrets)
  revalidatePath("/")
  return { success: true }
}

export async function addSecret(title: string, content: string) {
  const secrets = await getSecrets()
  const newSecret: Secret = {
    id: generateId(),
    title,
    content,
    isLocked: false,
  }

  await saveSecrets([...secrets, newSecret])
  return newSecret
}

export async function updateSecret(id: string, updates: Partial<Secret>) {
  const secrets = await getSecrets()
  const updatedSecrets = secrets.map((secret) => (secret.id === id ? { ...secret, ...updates } : secret))

  await saveSecrets(updatedSecrets)
  return updatedSecrets.find((secret) => secret.id === id)
}

export async function deleteSecret(id: string) {
  const secrets = await getSecrets()
  const filteredSecrets = secrets.filter((secret) => secret.id !== id)
  await saveSecrets(filteredSecrets)
  return { success: true }
}

// Bookmarks actions
export async function getBookmarks() {
  return await readData<BookmarksByCategory>("bookmarks", {
    youtube: [],
    study: [],
    fun: [],
    projects: [],
  })
}

export async function saveBookmarks(bookmarks: BookmarksByCategory) {
  await writeData("bookmarks", bookmarks)
  revalidatePath("/")
  return { success: true }
}

export async function addBookmark(title: string, url: string, icon: string, category: string) {
  const bookmarks = await getBookmarks()
  const newBookmark: Bookmark = {
    id: generateId(),
    title,
    url,
    icon,
  }

  // Ensure the category exists
  if (!bookmarks[category]) {
    bookmarks[category] = []
  }

  bookmarks[category] = [...bookmarks[category], newBookmark]
  await saveBookmarks(bookmarks)
  return newBookmark
}

export async function updateBookmark(id: string, category: string, updates: Partial<Bookmark>) {
  const bookmarks = await getBookmarks()

  if (!bookmarks[category]) {
    return null
  }

  const updatedCategoryBookmarks = bookmarks[category].map((bookmark) =>
    bookmark.id === id ? { ...bookmark, ...updates } : bookmark,
  )

  bookmarks[category] = updatedCategoryBookmarks
  await saveBookmarks(bookmarks)
  return bookmarks[category].find((bookmark) => bookmark.id === id)
}

export async function deleteBookmark(id: string, category: string) {
  const bookmarks = await getBookmarks()

  if (!bookmarks[category]) {
    return { success: false }
  }

  bookmarks[category] = bookmarks[category].filter((bookmark) => bookmark.id !== id)
  await saveBookmarks(bookmarks)
  return { success: true }
}
