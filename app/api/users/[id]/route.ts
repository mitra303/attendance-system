import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  if (!id) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    )
  }

  const body = await req.json()

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      name: body.name,
      email: body.email,
      doj: body.doj ? new Date(body.doj) : null,
      phone: body.phone,
      dept: body.department,
      repMgr: body.manager,
      repMgrEmail: body.reptMngEmail, // ✅ ADD THIS
      status: body.status
    }
  })

  return NextResponse.json(user)
}