import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { internId } = await req.json()

  const start = new Date()
  start.setHours(0,0,0,0)

  const end = new Date()
  end.setHours(23,59,59,999)

  // Check if already checked in today
  const existing = await prisma.attendance.findFirst({
    where:{
      internId: internId,
      date:{
        gte:start,
        lte:end
      }
    }
  })

  if(existing){
    return NextResponse.json(
      { message:"Already checked-in today" },
      { status:400 }
    )
  }

  const now = new Date()

  const attendance = await prisma.attendance.create({
    data:{
      internId: internId,
      date: now,
      inTime: now.toLocaleTimeString(),
      outTime: null,
      status: "Inside"
    }
  })

  return NextResponse.json(attendance)

}