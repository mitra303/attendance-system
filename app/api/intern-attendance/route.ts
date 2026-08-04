import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const internId = Number(searchParams.get("internId"))
  const month = Number(searchParams.get("month"))
  const year = Number(searchParams.get("year"))

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const attendance = await prisma.attendance.findMany({
    where: {
      internId: internId,
      date: {
        gte: startDate,
        lte: endDate
      }
    }
  })

  return NextResponse.json(attendance)
}