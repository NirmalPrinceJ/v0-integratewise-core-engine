import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    if (!filePath) {
      return Response.json({ error: "Missing path parameter" }, { status: 400 })
    }

    // Validate path to prevent directory traversal
    if (filePath.includes("..") || filePath.startsWith("/")) {
      return Response.json({ error: "Invalid path" }, { status: 400 })
    }

    const fullPath = path.join(process.cwd(), "public/docs", filePath)
    
    // Ensure the resolved path is within the docs directory
    const docsDir = path.join(process.cwd(), "public/docs")
    if (!fullPath.startsWith(docsDir)) {
      return Response.json({ error: "Invalid path" }, { status: 400 })
    }

    if (!fs.existsSync(fullPath)) {
      return Response.json({ error: "File not found" }, { status: 404 })
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    return Response.json({ content, path: filePath })
  } catch (error) {
    console.error("Error reading document:", error)
    return Response.json(
      { error: "Failed to read document" },
      { status: 500 }
    )
  }
}
