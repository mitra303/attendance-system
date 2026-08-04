import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""

  const interns = await prisma.user.findMany({
    where: {
      role: 3,
      status: "active",
      name: {
        contains: q
      }
    },
    select: {
      id: true,
      name: true,
      email: true
    },
    take: 5
  })

  return NextResponse.json(interns)

}