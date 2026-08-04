import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendLeaveApprovalMail } from "@/lib/leave-approval-mail"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const userId = Number(body.userId)
    const fromHalfDay = body.fromHalfDay
    const toHalfDay = body.toHalfDay

    // 🔹 fetch leave balance
    const balance = await prisma.leaveBalance.findUnique({
      where: { userId }
    })

    if (!balance) {
      return NextResponse.json(
        { error: "Leave balance not found" },
        { status: 400 }
      )
    }

    // 🔹 balance check
    if (body.leaveType === "Casual Leave" && balance.casual <= 0) {
      return NextResponse.json(
        { error: "No Casual Leave balance left" },
        { status: 400 }
      )
    }

    if (body.leaveType === "Earned Leave" && balance.earned <= 0) {
      return NextResponse.json(
        { error: "No Earned Leave balance left" },
        { status: 400 }
      )
    }

    if (body.leaveType === "Short Leave" && balance.short <= 0) {
      return NextResponse.json(
        { error: "No Short Leave balance left" },
        { status: 400 }
      )
    }

    // 🔹 NORMAL LEAVE DAYS CHECK
    if (body.leaveType !== "Short Leave") {

      const from = new Date(body.fromDate)
      const to = new Date(body.toDate)

      if (from > to) {
        return NextResponse.json(
          { error: "From date cannot be after To date" },
          { status: 400 }
        )
      }

      const diffTime = to.getTime() - from.getTime()
        let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        // half day adjustments
        if (fromHalfDay) {
          days -= 0.5
        }

        if (toHalfDay) {
          days -= 0.5
        }

        if (days <= 0) {
          return NextResponse.json(
            { error: "Invalid leave duration" },
            { status: 400 }
          )
        }

      if (body.leaveType === "Casual Leave" && days > balance.casual) {
        return NextResponse.json(
          { error: "Not enough Casual Leave balance" },
          { status: 400 }
        )
      }

      if (body.leaveType === "Earned Leave" && days > balance.earned) {
        return NextResponse.json(
          { error: "Not enough Earned Leave balance" },
          { status: 400 }
        )
      }

    }

    // 🔹 CHECK DUPLICATE / OVERLAPPING LEAVE
    if (body.leaveType !== "Short Leave") {

      const existingLeave = await prisma.leave.findFirst({
        where: {
          userId,
          status: { in: ["pending", "approved"] },
          fromDate: { lte: new Date(body.toDate) },
          toDate: { gte: new Date(body.fromDate) }
        }
      })

      if (existingLeave) {
        return NextResponse.json(
          { error: "Leave already applied for these dates" },
          { status: 400 }
        )
      }

    }

    // 🔹 SHORT LEAVE DUPLICATE CHECK
    if (body.leaveType === "Short Leave") {

      const existingShort = await prisma.leave.findFirst({
        where: {
          userId,
          leaveType: "Short Leave",
          date: new Date(body.date),
          status: { in: ["pending", "approved"] }
        }
      })

      if (existingShort) {
        return NextResponse.json(
          { error: "Short leave already applied for this date" },
          { status: 400 }
        )
      }

    }

    let data: any = {
      userId,
      leaveType: body.leaveType,
      reason: body.reason
    }

    // 🔹 SHORT LEAVE
    if (body.leaveType === "Short Leave") {

      if (body.startTime >= body.endTime) {
        return NextResponse.json(
          { error: "End time must be after start time" },
          { status: 400 }
        )
      }

      data.date = new Date(body.date)
      data.startTime = body.startTime
      data.endTime = body.endTime

    } else {

      data.fromDate = new Date(body.fromDate)
      data.toDate = new Date(body.toDate)

       // ✅ SAVE HALF DAY DATA
      data.fromHalfDay = body.fromHalfDay ?? false
      data.fromHalfType = body.fromHalfType ?? null

      data.toHalfDay = body.toHalfDay ?? false
      data.toHalfType = body.toHalfType ?? null

    }

    // 🔹 create leave
    const leave = await prisma.leave.create({
      data
    })

    // 🔹 get reporting manager email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        repMgrEmail: true
      }
    })

    let fromDate: string
    let toDate: string

    if (body.leaveType === "Short Leave") {

      fromDate =
        new Date(data.date).toLocaleDateString("en-IN") +
        " " +
        data.startTime

      toDate =
        new Date(data.date).toLocaleDateString("en-IN") +
        " " +
        data.endTime

    } else {

      fromDate = new Date(data.fromDate).toLocaleDateString("en-IN")
      toDate = new Date(data.toDate).toLocaleDateString("en-IN")

    }

    // 🔹 send mail to Reporting Manager
    if (user?.repMgrEmail) {
      await sendLeaveApprovalMail(
       leave.id,
        user.name,
        user.repMgrEmail,
        body.leaveType,
        fromDate,
        toDate,
        body.reason,
        body.fromHalfDay,
        body.fromHalfType,
        body.toHalfDay,
        body.toHalfType
      )
    }

    return NextResponse.json(leave)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to create leave" },
      { status: 500 }
    )

  }

}