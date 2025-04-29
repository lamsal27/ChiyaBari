import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data-service"

// Define the Secret type
export type Secret = {
  id: string
  title: string
  content: string
  isLocked: boolean
}

// GET handler to retrieve all secrets
export async function GET() {
  try {
    const secrets = await readData<Secret[]>("secrets", [])
    return NextResponse.json(secrets)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch secrets" }, { status: 500 })
  }
}

// POST handler to create or update secrets
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await writeData("secrets", data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save secrets" }, { status: 500 })
  }
}
