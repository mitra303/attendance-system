import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const holidays2026 = [
    { date: "2026-01-01", reason: "New Year's Day" },
    { date: "2026-01-26", reason: "Republic Day" },
    { date: "2026-03-04", reason: "Holi" },
    { date: "2026-08-15", reason: "Independence Day" },
    { date: "2026-08-28", reason: "Raksha Bandhan" },
    { date: "2026-09-04", reason: "Janmashtami" },
    { date: "2026-10-02", reason: "Gandhi Jayanti" },
    { date: "2026-10-20", reason: "Dussehra" },
    { date: "2026-11-09", reason: "Govardhan Puja" },
    { date: "2026-11-10", reason: "Vikram Samvat New Year" },
    { date: "2026-11-11", reason: "Bhai Dooj" }
]

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)

    const userId = searchParams.get("userId")
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    if (!start || !end) {
        return NextResponse.json({ error: "Start and End date required" })
    }

    const startDate = new Date(start)
    const endDate = new Date(end)
    endDate.setHours(23, 59, 59, 999)

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
    })

    const attendance = await prisma.attendance.findMany({
        where: {
            internId: Number(userId),
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    })

    const leaves = await prisma.leave.findMany({
        where: {
            userId: Number(userId),
            status: "approved"
        }
    })

    const rows: (string | number)[][] = []

    let current= new Date(startDate)
    let sr = 1

    while (current <= endDate) {

        const dateStr = current.toISOString().split("T")[0]

        let checkIn = ""
        let checkOut = ""
        let status = "Absent"

        const holiday = holidays2026.find(h => h.date === dateStr)

        if (holiday) {

            status = `Holiday (${holiday.reason})`

        } else if (current.getDay() === 0) {

            status = "Weekoff"

        } else {

            const leave = leaves.find(l => {
                if (!l.fromDate || !l.toDate) return false
                const from = new Date(l.fromDate)
                const to = new Date(l.toDate)
                return current >= from && current <= to
            })

            if (leave) {

                status = `Leave (${leave.leaveType})`

            } else {

                const att = attendance.find(a =>
                    a.date.toISOString().split("T")[0] === dateStr
                )

                if (att) {
                    checkIn = att.inTime
                    checkOut = att.outTime || ""
                    status = att.status
                }
            }
        }

        rows.push([
            sr++,
            user?.name || "",
            user?.email || "",
            user?.dept || "",
            user?.repMgr || "",
            dateStr,
            checkIn,
            checkOut,
            status
        ])

        current.setDate(current.getDate() + 1)
    }

    const csv = [
        [
            "Sr No",
            "Name",
            "Email",
            "Department",
            "Reporting Manager",
            "Date",
            "Check-In",
            "Check-Out",
            "Status"
        ],
        ...rows
    ]
        .map(e => e.join(","))
        .join("\n")

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=attendance-report.csv"
        }
    })
}