import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!
    }
})

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://115.241.45.146:8015/login"

export async function sendLeaveApprovedEmail(
    email: string,
    name: string,
    leaveType: string,
    status: "approved" | "rejected"
) {

    const isApproved = status === "approved"

    const title = isApproved ? "Leave Approved ✓" : "Leave Rejected ✖"
    const subject = isApproved ? "Leave Approved ✅" : "Leave Rejected ❌"
    const color = isApproved ? "#2e7d32" : "#e53935"
    const message = isApproved
        ? "Your leave request has been approved."
        : "Your leave request has been rejected."

    try {
        await transporter.sendMail({
            from: `"Attendance System" <${process.env.MAIL_USER}>`,
            to: email,
            //to: 'nitish@mitraindustries.com',
            subject: subject,

            html: `
<div style="background:#f4f6f8;padding:30px;font-family:Arial,Helvetica,sans-serif">

  <table align="center" width="520" style="background:white;border-radius:8px;padding:30px;box-shadow:0 4px 10px rgba(0,0,0,0.05)">
    
    <tr>
      <td style="text-align:center">
        <h2 style="margin:0;color:${color}">${title}</h2>
      </td>
    </tr>

    <tr>
      <td style="padding-top:20px">
        <p style="margin:0;font-size:15px">Hello <b>${name}</b>,</p>
      </td>
    </tr>

    <tr>
      <td style="padding-top:10px">
        <p style="margin:0;font-size:15px">
          ${message}
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding-top:20px">
        
        <table width="100%" style="background:#f9fafb;border-radius:6px;padding:15px">
          <tr>
            <td style="font-size:14px;color:#555"><b>Leave Type</b></td>
            <td style="font-size:14px;text-align:right">${leaveType}</td>
          </tr>
        </table>

      </td>
    </tr>

    <tr>
      <td style="padding-top:25px;text-align:center">
        <a href="${appUrl}/login"
           style="background:${color};color:white;padding:10px 18px;text-decoration:none;border-radius:5px;font-size:14px">
           View Dashboard
        </a>
      </td>
    </tr>

    <tr>
      <td style="padding-top:30px;font-size:14px;color:#555">
        Regards<br/>
        <b>Attendance Management System</b>
      </td>
    </tr>

  </table>

</div>
`
        })
        console.log("MAIL FUNCTION TRIGGERED", email)
    } catch (err) {
         console.error("MAIL ERROR:", err)
        console.error("Mail error:", err)
    }
}