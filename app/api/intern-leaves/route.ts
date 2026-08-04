import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url)

    const userId = Number(searchParams.get("userId"))
    const month = Number(searchParams.get("month"))
    const year = Number(searchParams.get("year"))

    if (!userId) {
        return NextResponse.json({ error: "UserId required" }, { status: 400 })
    }

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const leaves = await prisma.leave.findMany({
        where: {
            userId,
            status: "approved",
            OR: [
                {
                    date: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                {
                    fromDate: {
                        lte: endDate
                    },
                    toDate: {
                        gte: startDate
                    }
                }
            ]
        }
    })

    return NextResponse.json(leaves)
}