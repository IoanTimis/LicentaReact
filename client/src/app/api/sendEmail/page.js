'use server';

import nodemailer from "nodemailer";
import { generateEmailContent } from "@/utils/templateEmail";

export async function sendEmail(data) {
  const { to, title, actionMakerEmail, status, message, subject, role, language } = data;
  console.log("sendMailPAge: ",data.link);

  let link = data.link || "http://localhost:3000/";

  console.log("Link generated SendEmailPAge:", link);

  if (!to || !title || !actionMakerEmail || !status || !message || !subject || !role || !language) {
    throw new Error("All fields are required.");
  }

  const emailContent = generateEmailContent({ 
    title, 
    actionMakerEmail, 
    status, 
    message, 
    role, 
    language, 
    link 
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Platforma UVT" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${subject}`,
    html: emailContent, 
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent successfully:", info.response);
  return { success: true, response: info.response };
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await sendEmail(data);
    return new Response(JSON.stringify({ message: "Email sent successfully", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "An error occurred while sending email. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
