import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { internId } = await req.json()

  const now = new Date()

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const record = await prisma.attendance.findFirst({
    where: {
      internId,
      date: {
        gte: start,
        lte: end
      }
    }
  })

  // ❌ Check-in hi nahi hua
  if (!record) {
    return NextResponse.json(
      { message: "Please check-in first" },
      { status: 400 }
    )
  }

  // ❌ Already checkout ho chuka
  if (record.outTime) {
    return NextResponse.json(
      { message: "Already checked-out today" },
      { status: 400 }
    )
  }

  const updated = await prisma.attendance.update({
    where: { id: record.id },
    data: {
      outTime: now.toLocaleTimeString(),
       status:"Completed"
    }
  })

  return NextResponse.json(updated)

}