import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as nodemailer from "nodemailer";
import { getSession } from "@/lib/auth";

// Email transporter configuration
function createTransporter() {
  return nodemailer.createTransport({
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
}

// Send payment confirmation email to customer
async function sendPaymentConfirmationEmail(booking: {
  fullName: string;
  email: string;
  tourName: string | null;
  tourPrice: number | null;
  amountPaid: number;
  bankTransferRef: string | null;
  preferredStartDate: Date | null;
}) {
  const transporter = createTransporter();

  const formatDate = (date: Date | null) => {
    if (!date) return "To be confirmed";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const mailOptions = {
    from: "udelgombotamira@gmail.com",
    to: booking.email,
    subject: `✅ Payment Confirmed - ${
      booking.tourName || "Your Tour Booking"
    }`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Confirmed! ✅</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #333;">Dear <strong>${
            booking.fullName
          }</strong>,</p>
          
          <p style="color: #555;">Great news! We have received and verified your bank transfer payment. Your booking is now confirmed!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="margin-top: 0; color: #28a745;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Tour:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${
                  booking.tourName || "N/A"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Start Date:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${formatDate(
                  booking.preferredStartDate
                )}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Reference:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right; font-family: monospace;">${
                  booking.bankTransferRef || "N/A"
                }</td>
              </tr>
              <tr style="border-top: 1px solid #ddd;">
                <td style="padding: 12px 0; color: #666;">Amount Paid:</td>
                <td style="padding: 12px 0; font-weight: bold; text-align: right; font-size: 20px; color: #28a745;">$${booking.amountPaid.toFixed(
                  2
                )} USD</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2e7d32;">
              <strong>✓ What's Next?</strong><br>
              Our team will contact you shortly with detailed tour information, meeting points, and everything you need for your adventure in Mongolia!
            </p>
          </div>
          
          <p style="color: #555;">If you have any questions, please don't hesitate to contact us.</p>
          
          <p style="color: #555;">
            Best regards,<br>
            <strong>Maralgoo Dreamland Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
          <p>Maralgoo Dreamland | Your Adventure Awaits</p>
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Send notification to admin
async function sendAdminNotificationEmail(booking: {
  fullName: string;
  email: string;
  tourName: string | null;
  amountPaid: number;
  bankTransferRef: string | null;
}) {
  const transporter = createTransporter();

  const mailOptions = {
    from: "udelgombotamira@gmail.com",
    to: "udelgombotamira@gmail.com",
    subject: `💰 Bank Transfer Confirmed - ${booking.fullName}`,
    html: `
      <h2>Bank Transfer Payment Confirmed</h2>
      <p><strong>Customer:</strong> ${booking.fullName}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Tour:</strong> ${booking.tourName || "N/A"}</p>
      <p><strong>Amount:</strong> $${booking.amountPaid.toFixed(2)} USD</p>
      <p><strong>Reference:</strong> ${booking.bankTransferRef || "N/A"}</p>
      <p><strong>Confirmed At:</strong> ${new Date().toLocaleString()}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: Request) {
  try {
    // Verify admin is logged in
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, amountPaid, note } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Find the booking request
    const bookingRequest = await prisma.requestInfo.findUnique({
      where: { id: requestId },
    });

    if (!bookingRequest) {
      return NextResponse.json(
        { error: "Booking request not found" },
        { status: 404 }
      );
    }

    // Calculate new amount paid
    const newAmountPaid = amountPaid || bookingRequest.advanceRequired || 0;
    const totalPaid = bookingRequest.amountPaid + newAmountPaid;

    // Determine payment status
    let paymentStatus: "PENDING" | "PARTIAL" | "PAID" = "PARTIAL";
    if (totalPaid >= (bookingRequest.tourPrice || 0)) {
      paymentStatus = "PAID";
    } else if (totalPaid >= (bookingRequest.advanceRequired || 0)) {
      paymentStatus = "PARTIAL";
    }

    // Update the booking request
    const updatedRequest = await prisma.requestInfo.update({
      where: { id: requestId },
      data: {
        amountPaid: totalPaid,
        paymentStatus,
        bookingStatus: "CONFIRMED",
        paymentMethod: "bank_transfer",
      },
    });

    // Send confirmation email to customer
    try {
      await sendPaymentConfirmationEmail({
        fullName: updatedRequest.fullName,
        email: updatedRequest.email,
        tourName: updatedRequest.tourName,
        tourPrice: updatedRequest.tourPrice,
        amountPaid: totalPaid,
        bankTransferRef: requestId, // Use request ID as reference for now
        preferredStartDate: updatedRequest.preferredStartDate,
      });
      console.log("Payment confirmation email sent to:", updatedRequest.email);
    } catch (emailError) {
      console.error("Failed to send customer email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification to admin
    try {
      await sendAdminNotificationEmail({
        fullName: updatedRequest.fullName,
        email: updatedRequest.email,
        tourName: updatedRequest.tourName,
        amountPaid: totalPaid,
        bankTransferRef: requestId,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Payment confirmed and email sent",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error confirming bank transfer:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
