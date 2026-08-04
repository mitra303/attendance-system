import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const { employeeId, password } = body

    const user = await prisma.user.findUnique({
      where: { email: employeeId }
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      )
    }

    // ✅ check password exists
    if (!user.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }
     // ✅ STATUS CHECK
    if (user.status !== "active") {
      return NextResponse.json(
        { message: "Account is inactive. Contact admin." },
        { status: 403 }
      )
    }

    const token = jwt.sign(
     { id: user.id, role: user.role, name: user.name },
      "secretkey",
      { expiresIn: "1d" }
    )

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
      id: user.id
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/"
    })

    return response

  } catch (error) {

    console.error("LOGIN ERROR:", error)

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )

  }

}