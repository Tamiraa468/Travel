import * as nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Sending email..."); // Debug log
  try {
    const { name, email, message } = await req.json();

    console.log("Creating transporter..."); // Debug log
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "udelgombotamira@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });
    console.log("Transporter created successfully"); // Debug log

    const mailOptions = {
      from: email,
      to: "udelgombotamira@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
