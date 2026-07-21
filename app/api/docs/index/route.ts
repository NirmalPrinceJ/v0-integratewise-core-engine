import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const docsDir = path.join(process.cwd(), "public/docs")
    
    if (!fs.existsSync(docsDir)) {
      return Response.json({ files: [] })
    }

    const files = getAllFiles(docsDir)
      .map((file) => ({
        path: file.replace(docsDir, "").substring(1),
        name: path.basename(file),
        type: "file",
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return Response.json({ files })
  } catch (error) {
    console.error("Error indexing docs:", error)
    return Response.json({ files: [], error: "Failed to index docs" }, { status: 500 })
  }
}

function getAllFiles(dir: string): string[] {
  let files: string[] = []
  try {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const full = path.join(dir, item)
      try {
        if (fs.statSync(full).isDirectory()) {
          files = files.concat(getAllFiles(full))
        } else {
          files.push(full)
        }
      } catch (e) {
        // Skip files we can't stat
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }

  return files
}
