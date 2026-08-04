import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const userId = Number(searchParams.get("userId"))
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 5)
  const search = searchParams.get("search") || ""

  const skip = (page - 1) * limit

  const whereCondition = {
    userId,
    OR: [
      { leaveType: { contains: search } },
      { reason: { contains: search } }
    ]
  }

  const leaves = await prisma.leave.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" }
  })

  const total = await prisma.leave.count({
    where: whereCondition
  })

  return NextResponse.json({
    leaves,
    total
  })
}