import nodemailer from "nodemailer"

export async function sendCredentials(email: string, password: string) {

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
    from: `"Attendance System" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Attendance System Account Credentials",

    html: `
    <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,sans-serif">
      
      <table align="center" width="600" cellpadding="0" cellspacing="0"
      style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        
        <tr>
          <td style="background:#4f46e5;color:white;padding:20px;text-align:center">
            <h2 style="margin:0">Attendance System</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:30px">

            <h3 style="margin-top:0;color:#333">Welcome to the Team 🎉</h3>

            <p style="color:#555;font-size:15px">
              Your account has been successfully created.  
              Please use the following credentials to login.
            </p>

            <table width="100%" cellpadding="10"
            style="margin-top:20px;border:1px solid #eee;border-radius:6px">
              
              <tr style="background:#f9fafb">
                <td style="font-weight:bold;color:#333">Email</td>
                <td style="color:#555">${email}</td>
              </tr>

              <tr>
                <td style="font-weight:bold;color:#333">Password</td>
                <td style="color:#555">${password}</td>
              </tr>

            </table>

            <p style="margin-top:20px;color:#555">
              For security reasons, please change your password after logging in.
            </p>

            <div style="text-align:center;margin-top:30px">
              <a href="http://115.241.45.146:8015/login"
              style="background:#4f46e5;color:white;padding:12px 25px;
              text-decoration:none;border-radius:6px;font-weight:bold">
                Login to Account
              </a>
            </div>

          </td>
        </tr>

        <tr>
          <td style="background:#f9fafb;text-align:center;padding:15px;font-size:12px;color:#888">
            © ${new Date().getFullYear()} Attendance System
          </td>
        </tr>

      </table>

    </div>
    `
  })
}