import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const body = await req.json()

  const { internId, date, inTime, outTime } = body

  const attendance = await prisma.attendance.create({
    data: {
      internId,
      date: new Date(date),
      inTime,
      outTime
    }
  })

  return NextResponse.json(attendance)
}