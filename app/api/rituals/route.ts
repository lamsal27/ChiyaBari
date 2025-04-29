import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data-service"

// Define the Task type
export type Task = {
  id: string
  text: string
  completed: boolean
}

// GET handler to retrieve all tasks
export async function GET() {
  try {
    const tasks = await readData<Task[]>("rituals", [])
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rituals" }, { status: 500 })
  }
}

// POST handler to create or update tasks
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await writeData("rituals", data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save rituals" }, { status: 500 })
  }
}
