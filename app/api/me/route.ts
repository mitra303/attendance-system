import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET() {

  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const decoded: any = jwt.verify(token, "secretkey")

    return NextResponse.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role
      }
    })

  } catch (err) {

    console.log("ME API ERROR:", err)

    return NextResponse.json({ user: null })

  }

}