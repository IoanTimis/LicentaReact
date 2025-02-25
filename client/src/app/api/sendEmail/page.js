'use server';

import nodemailer from "nodemailer";

export async function sendEmail(data) {
  const { to, title, actionMakerEmail, status, message, subject, role, language } = data;

  if (!to || !title || !actionMakerEmail || !status || !message || !subject || !role || !language) {
    throw new Error("All fields are required.");
  }

  let strongTitle = "";
  let strongEmail = "";
  let strongStatus = "";
  let strongMessage = "";
  let statusColor = "";
  console.log(status,"status")

  strongTitle = language === "ro" ? "Titlu Tema" : "Theme Title";
  strongStatus = language === "ro" ? "Stare:" : "Status:";
  strongMessage = language === "ro" ? "Mesaj:" : "Message:";
  statusColor = ["Rejected", "Respinsă", "Ștearsă", "Deleted"].includes(status) ? "red" : "green";

  if (role === "student") {
    strongEmail = language === "ro" ? "Email Student:" : "Student Email:";
  } else {
    strongEmail = language === "ro" ? "Email Profesor:" : "Teacher Email:";
  }

  //TODO e mereu rosu, trb vazut de ce
  

  const emailContent = `
    <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ccc; border-radius: 10px; padding: 20px; font-size: 18px;">
      <h2 style="color: #007BFF; text-align: center; font-size: 26px;">Email Automat Informativ</h2>
      <hr style="margin: 20px 0;">
      <p style="margin-bottom: 15px;"><strong>${strongTitle}</strong> <span style="font-size: 20px;">${title}</span></p>
      <p style="margin-bottom: 15px;"><strong>${strongEmail}</strong> <a href="mailto:${actionMakerEmail}" style="font-size: 20px; color: #007BFF;">${actionMakerEmail}</a></p>
      <p style="margin-bottom: 15px;"><strong>${strongStatus}</strong> <span style="color: ${statusColor}; font-size: 20px;">${status}</span></p>
      <p style="margin-bottom: 15px;"><strong>${strongMessage}</strong> <span style="font-size: 20px;">${message}</span></p>
      <hr style="margin: 20px 0;">
      <p style="text-align: center; font-size: 18px;"><a href="https://www.uvt.ro" style="color: #007BFF; text-decoration: none; font-size: 18px;">Platforma UVT</a></p>
      <p style="text-align: center; color: #888; font-size: 16px;">Mulțumim pentru utilizarea platformei UVT!</p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Setăm detaliile emailului
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
