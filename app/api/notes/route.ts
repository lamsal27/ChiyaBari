import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data-service"

// Define the Note type
export type Note = {
  id: string
  title: string
  content: string
  isPinned: boolean
  lastEdited: string
}

// GET handler to retrieve all notes
export async function GET() {
  try {
    const notes = await readData<Note[]>("notes", [])
    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

// POST handler to create or update notes
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await writeData("notes", data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save notes" }, { status: 500 })
  }
}
