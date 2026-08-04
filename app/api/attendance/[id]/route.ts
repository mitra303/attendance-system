import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

function convertTo12Hour(time: string) {

  if (!time) return ""

  // agar already AM/PM hai to wapas return karo
  if (time.includes("AM") || time.includes("PM")) {
    return time
  }

  const parts = time.split(":")

  const hour = parts[0]
  const minute = parts[1]
  const second = parts[2] || ""

  const h = Number(hour)

  const ampm = h >= 12 ? "PM" : "AM"

  const newHour = h % 12 || 12

  if (second) {
    return `${newHour}:${minute}:${second} ${ampm}`
  }

  return `${newHour}:${minute} ${ampm}`
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

    const body = await req.json()

    await prisma.attendance.update({
      where: {
        id: Number(id)
      },
      data: {
        inTime: convertTo12Hour(body.inTime),
        outTime: convertTo12Hour(body.outTime),
        status: body.status
      }
    })

    return NextResponse.json({
      message: "Attendance updated"
    })

  } catch (error) {

    console.error("UPDATE ERROR:", error)

    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    )

  }

}