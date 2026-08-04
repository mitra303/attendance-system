import { prisma } from "@/lib/prisma"
import { sendLeaveApprovedEmail } from "@/lib/user-leave-conformation"

function pageTemplate(icon: string, title: string, message: string, color: string) {
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
  background: linear-gradient(135deg,#eef2f7,#f9fbff);
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}

.card{
  background:white;
  padding:40px;
  border-radius:14px;
  box-shadow:0 12px 30px rgba(0,0,0,0.1);
  text-align:center;
  width:420px;
}

.icon{
  font-size:64px;
  color:${color};
}

.title{
  font-size:26px;
  margin-top:15px;
  font-weight:bold;
}

.text{
  color:#555;
  margin-top:12px;
  font-size:15px;
}

.footer{
  margin-top:30px;
  font-size:13px;
  color:#aaa;
}

.btn{
  margin-top:20px;
  padding:10px 18px;
  border:none;
  border-radius:6px;
  background:${color};
  color:white;
  font-size:14px;
  cursor:pointer;
}

</style>
</head>

<body>

<div class="card">

<div class="icon">${icon}</div>

<div class="title">
${title}
</div>

<p class="text">
${message}
</p>

<button class="btn" onclick="window.close()">Close Tab</button>

<div class="footer">
Intern Attendance System
</div>

</div>

</body>
</html>
`
}

export async function GET(req: Request) {




  const { searchParams } = new URL(req.url)
  const leaveId = Number(searchParams.get("id"))

  const leave = await prisma.leave.findUnique({
  where: { id: leaveId },
  include: {
    user: true
  }
})

  if (!leave) {
    return new Response(
      pageTemplate("⚠", "Leave Not Found", "The requested leave does not exist.", "#ff9800"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  if (leave.status === "approved") {
    return new Response(
      pageTemplate("✔", "Leave Already Approved", "This leave request has already been approved.", "#2e7d32"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  if (leave.status === "rejected") {
    return new Response(
      pageTemplate("✖", "Leave Already Rejected", "This leave request was already rejected.", "#e53935"),
      { headers: { "Content-Type": "text/html" } }
    )
  }

  await prisma.leave.update({
    where: { id: leaveId },
    data: { status: "rejected" }
  })


try {

  if (!leave.user?.email) {
    console.log("EMAIL NOT FOUND")
  }

  if (leave.user?.email) {

    console.log("SENDING MAIL:", leave.user.email)

    await sendLeaveApprovedEmail(
      leave.user.email,
      leave.user.name,
      leave.leaveType,
      "rejected"
    )

    console.log("MAIL SENT SUCCESSFULLY")

  }

} catch (error) {

  console.error("MAIL ERROR:", error)

}

  return new Response(
    pageTemplate("✖", "Leave Rejected", "The leave request has been rejected successfully.", "#e53935"),
    { headers: { "Content-Type": "text/html" } }
  )
}