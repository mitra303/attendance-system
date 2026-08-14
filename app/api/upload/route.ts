import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export async function POST(req: Request) {

  try {

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name)
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`

    await writeFile(path.join(UPLOAD_DIR, safeName), buffer)

    return NextResponse.json({
      message: "File uploaded successfully",
      url: `/api/uploads/${safeName}`,
      name: file.name
    })

  } catch (error) {

    console.error("UPLOAD ERROR:", error)

    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    )

  }

}
