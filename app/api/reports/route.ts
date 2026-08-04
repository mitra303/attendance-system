import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page") || 1)
    const q = (searchParams.get("q") || "").trim()

    const take = 10
    const skip = (page - 1) * take

    const isDateSearch = /^\d{4}-\d{2}-\d{2}$/.test(q)

    const filters: any[] = [
      { user: { is: { name: { contains: q } } } },
      { user: { is: { email: { contains: q } } } },
      { user: { is: { dept: { contains: q } } } },
      { user: { is: { phone: { contains: q } } } }
    ]

    if (isDateSearch) {

      const dateQuery = new Date(q)

      filters.push({
        date: {
          gte: new Date(dateQuery.setHours(0, 0, 0, 0)),
          lte: new Date(dateQuery.setHours(23, 59, 59, 999))
        }
      })

    }

    const whereCondition = q ? { OR: filters } : {}

    const reports = await prisma.attendance.findMany({
      where: whereCondition,
      include: {
        user: true
      },
      orderBy: {
        date: "desc"
      },
      skip,
      take
    })

    const total = await prisma.attendance.count({
      where: whereCondition
    })

    return NextResponse.json({
      reports,
      page,
      totalPages: Math.ceil(total / take),
      totalRecords: total
    })

  } catch (error) {

    console.error("Error fetching reports:", error)

    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )

  }

}