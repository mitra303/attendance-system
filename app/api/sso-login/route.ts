import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const SSO_AUTH_API_URL = process.env.SSO_AUTH_API_URL || "http://115.241.45.146:8016/accounts/auth-subapp/"
const SSO_APP_NAME = process.env.SSO_APP_NAME || "Attendance-System"
const DEFAULT_PASSWORD = "Employee@1234"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      )
    }

    const ssoRes = await fetch(
      `${SSO_AUTH_API_URL}?app_name=${encodeURIComponent(SSO_APP_NAME)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!ssoRes.ok) {
      return NextResponse.json(
        { message: "Invalid or expired SSO token" },
        { status: 401 }
      )
    }

    const ssoData = await ssoRes.json()
    const ssoUser = ssoData.user

    if (!ssoUser?.email || !ssoUser?.full_name) {
      return NextResponse.json(
        { message: "Invalid SSO response" },
        { status: 502 }
      )
    }

    let user = await prisma.user.findUnique({
      where: { email: ssoUser.email }
    })

    if (!user) {

      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

      user = await prisma.user.create({
        data: {
          name: ssoUser.full_name,
          email: ssoUser.email,
          password: hashedPassword,
          role: 3,
          status: ssoUser.is_active === false ? "inactive" : "active"
        }
      })

      if (user.role === 3 && user.status === "active") {

        await prisma.leaveBalance.upsert({
          where: { userId: user.id },
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

    }

    if (user.status !== "active") {
      return NextResponse.json(
        { message: "Account is inactive. Contact admin." },
        { status: 403 }
      )
    }

    const localToken = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      "secretkey",
      { expiresIn: "1d" }
    )

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
      id: user.id
    })

    response.cookies.set("token", localToken, {
      httpOnly: true,
      path: "/"
    })

    return response

  } catch (error) {

    console.error("SSO LOGIN ERROR:", error)

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )

  }

}
