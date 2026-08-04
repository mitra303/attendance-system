import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const userId = Number(searchParams.get("userId"))

  const balance = await prisma.leaveBalance.findUnique({
    where: { userId }
  })

  if (!balance) {
    return NextResponse.json({
      casual: 0,
      earned: 0,
      short: 0,
      totalTaken: 0,
      earnedUtilization: 0
    })
  }

  // total approved leave count
  const totalTaken = await prisma.leave.count({
    where: {
      userId,
      status: "approved"
    }
  })

  // earned used
  const earnedUsed = await prisma.leave.count({
    where: {
      userId,
      leaveType: "Earned Leave",
      status: "approved"
    }
  })

  const earnedUtilization =
    balance.earned === 0
      ? 0
      : Math.round((earnedUsed / balance.earned) * 100)

  return NextResponse.json({
    casual: balance.casual,
    earned: balance.earned,
    short: balance.short,
    totalTaken,
    earnedUtilization
  })
}