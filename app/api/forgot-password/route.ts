import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import nodemailer from "nodemailer"

export async function POST(req: Request) {

  const { email } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return Response.json(
      { message: "Email not found" },
      { status: 400 }
    )
  }

  const token = randomBytes(32).toString("hex")

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token
    }
  })

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER!,
      pass: process.env.MAIL_PASS!
    }
  })

  await transporter.sendMail({
    from: `"Calibration System" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Reset your Password",
    html: `
        <p>You requested password reset</p>
        <p>Click below link to reset password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 30 minutes.</p>
      `,
  })

  return Response.json({
    message: "Reset link sent to your email"
  })
}