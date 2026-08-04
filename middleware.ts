import { NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

export function middleware(req: any) {

  const token = req.cookies.get("token")?.value
  const path = req.nextUrl.pathname

  // allow login page
  if (path === "/login") {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {

    const decoded: any = jwtDecode(token)
    const role = decoded.role

    if (path.startsWith("/admin") && role != 1) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (path.startsWith("/guard") && role != 4) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (path.startsWith("/intern") && role != 3) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (path.startsWith("/hr") && role != 2) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()

  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }

}

export const config = {
  matcher: [
    "/admin/:path*",
    "/guard/:path*",
    "/intern/:path*",
    "/hr/:path*",
    "/dashboard/:path*"
  ]
}