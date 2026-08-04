import nodemailer from "nodemailer"

export async function sendLeaveApprovalMail(
  // leaveId: number, name: string, userEmail: string, leaveType: string, fromDate: Date, toDate: Date, reason: string
leaveId: number,
  name: string,
  userEmail: string,
  leaveType: string,
  fromDate: string,
  toDate: string,
  reason: string,
  fromHalfDay?: boolean,
  fromHalfType?: string,
  toHalfDay?: boolean,
  toHalfType?: string

) {

    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER!,
            pass: process.env.MAIL_PASS!
        }
    })

    const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/leave/approve?id=${leaveId}`
    const rejectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/leave/reject?id=${leaveId}`



    let fromLabel = fromDate
    let toLabel = toDate

    if (fromHalfDay) {
      fromLabel += ` (${fromHalfType})`
    }

    if (toHalfDay) {
      toLabel += ` (${toHalfType})`
    }


    await transporter.sendMail({
        from: `"Attendance System" <${process.env.MAIL_USER}>`,
        to: userEmail, // HR email
        subject: "Attendance System:- Leave Approval Required",
        html: `

  <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f6fa;padding:20px">

<div style="max-width:520px;margin:auto;background:white;border-radius:8px;border:1px solid #e5e5e5;padding:25px">

  <h2 style="margin-top:0;color:#333">Leave Request</h2>

  <table style="width:100%;font-size:14px;border-collapse:collapse">

     <tr>
      <td style="padding:6px 0;font-weight:bold;width:150px">Employee Email</td>
      <td>${name}</td>
    </tr>

    <tr>
      <td style="padding:6px 0;font-weight:bold">Leave Type</td>
      <td>${leaveType}</td>
    </tr>

    <tr>
      <td style="padding:6px 0;font-weight:bold">From Date</td>
      <td>${fromLabel}</td>
    </tr>

    <tr>
      <td style="padding:6px 0;font-weight:bold">To Date</td>
      <td>${toLabel}</td>
    </tr>

    <tr>
      <td style="padding:6px 0;font-weight:bold">Reason</td>
      <td>${reason}</td>
    </tr>

  </table>

  <div style="margin-top:25px">

    <p style="font-weight:bold;margin-bottom:10px;color:#444">
      Manager Actions
    </p>

    <a href="${approveUrl}"
      style="
        background:#16a34a;
        color:white;
        padding:10px 18px;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
        display:inline-block;
        margin-right:10px
      ">
      ✔ APPROVE
    </a>

    <a href="${rejectUrl}"
      style="
        background:#dc2626;
        color:white;
        padding:10px 18px;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
        display:inline-block
      ">
      ✖ REJECT
    </a>

  </div>

  <p style="margin-top:25px;font-size:12px;color:#888">
    Attendance System • Automated Leave Notification
  </p>

</div>
  </div>
  `
    })
}