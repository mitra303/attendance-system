import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const q = searchParams.get("q") || ""
    const page = Number(searchParams.get("page") || 1)

    const take = 10
    const skip = (page - 1) * take

    const start = new Date()
    start.setHours(0,0,0,0)

    const end = new Date()
    end.setHours(23,59,59,999)

    const where:any = {
      date:{
        gte:start,
        lte:end
      }
    }

    if(q){
      where.user = {
        is:{
          name:{
            contains:q
          }
        }
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include:{ user:true },
      orderBy:{ id:"desc" },
      skip,
      take
    })

    const total = await prisma.attendance.count({ where })

    return NextResponse.json({
      attendance,
      totalPages: Math.ceil(total / take)
    })

  } catch(err){

    console.error(err)

    return NextResponse.json(
      { error:"Server error" },
      { status:500 }
    )

  }

}