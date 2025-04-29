import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data-service"

// Define the Bookmark type
export type Bookmark = {
  id: string
  title: string
  url: string
  icon: string
}

// Define the BookmarksByCategory type
export type BookmarksByCategory = {
  youtube: Bookmark[]
  study: Bookmark[]
  fun: Bookmark[]
  projects: Bookmark[]
  [key: string]: Bookmark[]
}

// GET handler to retrieve all bookmarks
export async function GET() {
  try {
    const bookmarks = await readData<BookmarksByCategory>("bookmarks", {
      youtube: [],
      study: [],
      fun: [],
      projects: [],
    })
    return NextResponse.json(bookmarks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

// POST handler to create or update bookmarks
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await writeData("bookmarks", data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save bookmarks" }, { status: 500 })
  }
}
