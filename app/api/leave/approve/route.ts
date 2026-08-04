import { prisma } from "@/lib/prisma"
import { sendLeaveApprovedEmail } from "@/lib/user-leave-conformation"

function renderPage(icon: string, title: string, message: string, color: string) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Leave Status</title>

<style>

body{
  margin:0;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(135deg,#eef2f7,#f8fafc);
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}

.card{
  background:white;
  width:420px;
  padding:40px;
  border-radius:14px;
  box-shadow:0 15px 35px rgba(0,0,0,0.1);
  text-align:center;
}

.icon{
  font-size:70px;
  color:${color};
}

.title{
  font-size:26px;
  font-weight:bold;
  margin-top:10px;
}

.message{
  margin-top:12px;
  color:#555;
  line-height:1.5;
}

.button{
  margin-top:25px;
  background:${color};
  border:none;
  color:white;
  padding:10px 20px;
  border-radius:6px;
  cursor:pointer;
  font-size:14px;
}

.button:hover{
  opacity:0.9;
}

.footer{
  margin-top:25px;
  font-size:12px;
  color:#999;
}

</style>
</head>

<body>

<div class="card">

<div class="icon">${icon}</div>

<div class="title">${title}</div>

<p class="message">${message}</p>

<button class="button" onclick="window.close()">Close Tab</button>

<div class="footer">
Intern Attendance Management System
</div>

</div>

</body>
</html>
`
}

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const leaveId = Number(searchParams.get("id"))

  if (!leaveId) {
    return new Response(
      renderPage("⚠", "Invalid Request", "Leave ID is missing or invalid.", "#ff9800"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  const leave = await prisma.leave.findUnique({
    where: { id: leaveId },
    include: {
      user: true
    }
  })

  if (!leave) {
    return new Response(
      renderPage("⚠", "Leave Not Found", "The requested leave does not exist.", "#ff9800"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  if (leave.status === "approved") {
    return new Response(
      renderPage("✔", "Leave Already Approved", "This leave request has already been approved.", "#2e7d32"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  if (leave.status === "rejected") {
    return new Response(
      renderPage("✖", "Leave Already Rejected", "This leave request has already been rejected.", "#e53935"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  // approve leave
  await prisma.leave.update({
    where: { id: leaveId },
    data: { status: "approved" }
  })

  const balance = await prisma.leaveBalance.findUnique({
    where: { userId: leave.userId }
  })

  let leaveDays = 1

  if (leave.leaveType !== "Short Leave") {

    const from = new Date(leave.fromDate!)
    const to = new Date(leave.toDate!)

    const diffTime = to.getTime() - from.getTime()
    leaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

   if (leave.fromHalfDay === true) {
      leaveDays -= 0.5
    }

    if (leave.toHalfDay === true) {
      leaveDays -= 0.5
    }

    // ✅ add this line
    leaveDays = Math.max(leaveDays, 0.5)

  }

  if (!balance) {
    return new Response(
      renderPage("⚠", "Leave Balance Not Found", "Unable to locate leave balance for this user.", "#ff9800"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  // update leave balance
  if (leave.leaveType === "Casual Leave") {
    await prisma.leaveBalance.update({
      where: { userId: leave.userId },
      data: {
        casual: Math.max(balance.casual - leaveDays, 0)
      }
    })
  }

  if (leave.leaveType === "Earned Leave") {
    await prisma.leaveBalance.update({
      where: { userId: leave.userId },
      data: {
        earned: Math.max(balance.earned - leaveDays, 0)
      }
    })
  }

  if (leave.leaveType === "Short Leave") {
    await prisma.leaveBalance.update({
      where: { userId: leave.userId },
      data: {
        short: Math.max(balance.short - 1, 0)
      }
    })
  }


  // ✅ EMAIL SEND HERE
  if (leave.user?.email) {
    await sendLeaveApprovedEmail(
      leave.user.email,
      leave.user.name,
      leave.leaveType,
      "approved"
    )
  }

  return new Response(
    renderPage(
      "✔",
      "Leave Approved",
      "The leave request has been approved successfully.",
      "#2e7d32"
    ),
    { headers: { "Content-Type": "text/html" } }
  )
}