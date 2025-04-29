import path from "path"
import { promises as fsPromises } from "fs"

// Define the data directory path
const DATA_DIR = path.join(process.cwd(), "data")

// Ensure the data directory exists
export async function ensureDataDir() {
  try {
    await fsPromises.access(DATA_DIR)
  } catch (error) {
    await fsPromises.mkdir(DATA_DIR, { recursive: true })
  }
}

// Generic function to read data from a JSON file
export async function readData<T>(fileName: string, defaultData: T): Promise<T> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, `${fileName}.json`)

  try {
    await fsPromises.access(filePath)
    const fileData = await fsPromises.readFile(filePath, "utf-8")
    return JSON.parse(fileData) as T
  } catch (error) {
    // If file doesn't exist or can't be read, return default data
    await writeData(fileName, defaultData)
    return defaultData
  }
}

// Generic function to write data to a JSON file
export async function writeData<T>(fileName: string, data: T): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, `${fileName}.json`)

  try {
    await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (error) {
    console.error(`Error writing to ${fileName}.json:`, error)
    throw new Error(`Failed to save data to ${fileName}.json`)
  }
}

// Function to get a unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}
