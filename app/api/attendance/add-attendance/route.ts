import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { internId, date, inTime, outTime, status } = body

    // ✅ REQUIRED FIELD VALIDATION
    const missingFields = []

    if (!internId) missingFields.push("internId")
    if (!date) missingFields.push("Date")
    if (!inTime) missingFields.push("InTime")
    if (!outTime) missingFields.push("OutTime")

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `${missingFields.join(", ")} are required` },
        { status: 400 }
      )
    }

    // 🔥 normalize date (time hata do)
    const selectedDate = new Date(date)

    const startOfDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )

    const endOfDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23, 59, 59
    )

    // ❌ CHECK duplicate
    const existing = await prisma.attendance.findFirst({
      where: {
        internId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Attendance already marked for this date" },
        { status: 400 }
      )
    }

    // ✅ CREATE
    const attendance = await prisma.attendance.create({
      data: {
        internId,
        date: new Date(date),
        inTime,
        outTime,
        status: status || "Completed"
      }
    })

    return NextResponse.json(attendance)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}