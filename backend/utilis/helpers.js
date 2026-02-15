import nodemailer from "nodemailer";

export function Checkpassword(password, CornfirmPassword) {
  return password === CornfirmPassword;
}

export function generateCode() {
  return Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
}

// Create transporter ONCE (outside function)
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST, // smtp-relay.brevo.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// Optional: Check connection on startup
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Error:", err);
  } else {
    console.log("SMTP Ready ✅");
  }
});

export async function sendCode(email, code) {
  try {
    await transporter.sendMail({
      from: `"News App" <${process.env.BREVO_USER}>`,
      to: email,
      subject: "5 digit code from News app",
      text: `Your verification code is: ${code}`,
    });

    console.log("Email sent ✅");
  } catch (err) {
    console.error("Send mail failed ❌", err);
  }
}
