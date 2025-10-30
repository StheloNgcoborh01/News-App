import nodemailer from "nodemailer";


export function Checkpassword(password, CornfirmPassword) {
  return password === CornfirmPassword;
}


export function generateCode() {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 10) + 1).join('');
}

export async function sendCode(email, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "5 digit code from News app",
    text: code,
  });
}
