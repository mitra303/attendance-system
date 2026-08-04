import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sendCredentials } from "@/lib/sendMail"


function generatePassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

  let password = ""

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return password
}

const prisma = new PrismaClient()

export async function POST(req: Request) {

  try {

    const body = await req.json()

    if (
      !body.name ||
      !body.email ||
      !body.doj ||
      !body.phone ||
      !body.manager ||
      !body.reptMngEmail ||
      !body.status
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      )
    }

    /* -------- generate password -------- */
    const plainPassword = generatePassword()

    /* -------- hash password -------- */
    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        doj: new Date(body.doj),
        phone: String(body.phone),   // convert to number
        dept: body.department,
        role: 3,
        repMgr: body.manager,
        repMgrEmail: body.reptMngEmail,
        status: body.status
      }
    })


    // create leave balance automatically
    if (user.role === 3 && user.status === "active") {

      await prisma.leaveBalance.upsert({
        where: {
          userId: user.id
        },
        update: {},
        create: {
          userId: user.id,
          casual: 1,
          earned: 1,
          short: 2,
          lastUpdatedMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
        }
      })

    }

    /* -------- send credentials email -------- */
    await sendCredentials(body.email, plainPassword)

    return NextResponse.json({
      message: "User created successfully. Credentials sent to email.",
      user
    })


  } catch (error) {

    console.log(error) // IMPORTANT for debugging

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )

  }
}

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const q = searchParams.get("q") || ""
  const page = Number(searchParams.get("page") || 1)

  const limit = 10
  const skip = (page - 1) * limit

  const where = {
    // status: "active",
    role: {
    in: [3]
    },
    ...(q && {
      OR: [
        { name: { contains: q } },
        { email: { contains: q } }
      ]
    })
  }

  const users = await prisma.user.findMany({
    where,
    orderBy:{ createdAt:"desc" },
    skip,
    take:limit
  })

  const total = await prisma.user.count({ where })

  return NextResponse.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  })
}


export async function PUT(req:Request,{params}:any){

  const body = await req.json()

  const user = await prisma.user.update({
    where:{ id:Number(params.id) },
    data:{
      name:body.name,
      email:body.email,
      doj:new Date(body.doj),
      phone:body.phone,
      dept:body.department,
      repMgr:body.manager,
      repMgrEmail: body.reptMngEmail,
      status:body.status
    }
  })

  return NextResponse.json(user)

}