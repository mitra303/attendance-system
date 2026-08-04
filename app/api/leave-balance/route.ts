import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  const users = await prisma.user.findMany({
    where: {
      role: 3
    },
    include: {
      leaveBalance: true
    }
  })

  return NextResponse.json(users)

}