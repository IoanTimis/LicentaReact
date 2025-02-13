'use server';
import nodemailer from "nodemailer";

// Funcție care poate fi apelată cu parametru data
export async function sendEmail(data) {
  const { to, subject, text } = data;

  // Validăm datele
  if (!to || !subject || !text) {
    throw new Error("Toate câmpurile sunt necesare: to, subject, text");
  }

  // Configurăm Nodemailer
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
    subject,
    text,
  };

  // Trimitem emailul
  const info = await transporter.sendMail(mailOptions);
  console.log("Email trimis cu succes:", info.response);
  return { success: true, response: info.response };
}

// Next.js API route pentru apeluri HTTP
export async function POST(req) {
  try {
    const data = await req.json();
    const result = await sendEmail(data);
    return new Response(JSON.stringify({ message: "Email trimis cu succes!", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Eroare la trimiterea email-ului:", error);
    return new Response(JSON.stringify({ message: "Eroare la trimiterea email-ului." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
