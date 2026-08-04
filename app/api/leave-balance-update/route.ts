import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const body = await req.json()

  const { userId, casual, earned, short } = body

  const updated = await prisma.leaveBalance.update({
    where: {
      userId
    },
    data: {
      casual: Number(casual),
      earned: Number(earned),
      short: Number(short)
    }
  })

  return NextResponse.json(updated)

}