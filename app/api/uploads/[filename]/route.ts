import { NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {

  const { filename } = await params

  const safeName = path.basename(filename)
  const filePath = path.join(UPLOAD_DIR, safeName)

  if (!filePath.startsWith(UPLOAD_DIR)) {
    return NextResponse.json({ message: "Invalid file" }, { status: 400 })
  }

  try {

    await stat(filePath)
    const buffer = await readFile(filePath)

    const ext = path.extname(safeName).toLowerCase()
    const contentType = MIME_TYPES[ext] || "application/octet-stream"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${safeName}"`
      }
    })

  } catch {

    return NextResponse.json({ message: "File not found" }, { status: 404 })

  }

}
