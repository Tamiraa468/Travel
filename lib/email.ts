/**
 * Email helper for sending confirmation and notification emails
 * Uses Nodemailer with Gmail SMTP for email delivery
 *
 * Required environment variables in .env.local:
 * - SMTP_HOST: Gmail SMTP server (smtp.gmail.com)
 * - SMTP_PORT: SMTP port (465 for secure)
 * - SMTP_SECURE: Whether to use TLS (true for port 465)
 * - SMTP_USER: Gmail address for authentication
 * - SMTP_PASS: Google App Password (NOT your regular Gmail password)
 */

import nodemailer from "nodemailer";

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465");
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

// Recipient email for internal notifications
const INTERNAL_EMAIL = "udelgombotamira@gmail.com";

/**
 * Create and return a configured Nodemailer transporter for Gmail SMTP
 */
function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP credentials not configured. Emails will not be sent.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // true for port 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/**
 * Send confirmation email to the user
 * @param name - User's full name
 * @param email - User's email address
 * @param tourName - Name of the tour (if applicable)
 * @param adults - Number of adults
 * @param children - Number of children
 * @param preferredStartDate - Preferred tour start date
 */
export async function sendUserConfirmationEmail({
  name,
  email,
  tourName,
  adults,
  children,
  preferredStartDate,
}: {
  name: string;
  email: string;
  tourName?: string;
  adults?: number;
  children?: number;
  preferredStartDate?: string;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const startDateString = preferredStartDate
      ? new Date(preferredStartDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be determined";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .info-block { margin: 15px 0; }
            .label { font-weight: bold; color: #1f2937; }
            .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Request Received</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for requesting information about our tours! We've received your inquiry and will get back to you shortly.</p>
              
              <div class="info-block">
                <p><span class="label">Tour:</span> ${
                  tourName || "General Inquiry"
                }</p>
                <p><span class="label">Travelers:</span> ${
                  adults || 1
                } adult(s), ${children || 0} child(ren)</p>
                <p><span class="label">Preferred Start Date:</span> ${startDateString}</p>
              </div>

              <p>Our team will review your request and send you personalized recommendations and pricing within 24 hours.</p>
              
              <p>If you have any urgent questions, feel free to contact us directly.</p>
              
              <p>Best regards,<br/>The Tourism Team</p>
              
              <div class="footer">
                <p>© 2025 Tourism Platform. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: `Tour Request Confirmation - ${tourName || "Your Inquiry"}`,
      html: htmlContent,
    });

    console.log(`✓ Confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send user confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
}

/**
 * Send internal notification email to the tour agency
 * @param name - User's full name
 * @param email - User's email address
 * @param phone - User's phone number
 * @param tourName - Name of the tour
 * @param adults - Number of adults
 * @param children - Number of children
 * @param message - User's message
 * @param preferredStartDate - Preferred tour start date
 * @param marketingConsent - User's marketing consent
 */
export async function sendInternalNotificationEmail({
  name,
  email,
  phone,
  tourName,
  adults,
  children,
  message,
  preferredStartDate,
  marketingConsent,
}: {
  name: string;
  email: string;
  phone?: string;
  tourName?: string;
  adults?: number;
  children?: number;
  message?: string;
  preferredStartDate?: string;
  marketingConsent?: boolean;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const startDateString = preferredStartDate
      ? new Date(preferredStartDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not specified";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #fef2f2; padding: 20px; border: 1px solid #fee2e2; border-radius: 0 0 8px 8px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { text-align: left; background-color: #fecaca; padding: 10px; border: 1px solid #fca5a5; font-weight: bold; }
            td { padding: 10px; border: 1px solid #fca5a5; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Tour Information Request</h1>
            </div>
            <div class="content">
              <p><strong>A new request has been received. Please review and follow up:</strong></p>
              
              <table>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <td><strong>Full Name</strong></td>
                  <td>${name}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td><strong>Phone</strong></td>
                  <td>${phone || "Not provided"}</td>
                </tr>
                <tr>
                  <td><strong>Tour</strong></td>
                  <td>${tourName || "General Inquiry"}</td>
                </tr>
                <tr>
                  <td><strong>Adults</strong></td>
                  <td>${adults || 1}</td>
                </tr>
                <tr>
                  <td><strong>Children</strong></td>
                  <td>${children || 0}</td>
                </tr>
                <tr>
                  <td><strong>Preferred Start Date</strong></td>
                  <td>${startDateString}</td>
                </tr>
                <tr>
                  <td><strong>Marketing Consent</strong></td>
                  <td>${marketingConsent ? "Yes" : "No"}</td>
                </tr>
              </table>

              ${
                message
                  ? `<div style="background-color: white; padding: 10px; border-left: 4px solid #dc2626;"><strong>Message:</strong><p>${message.replace(
                      /\n/g,
                      "<br>"
                    )}</p></div>`
                  : ""
              }

              <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                This is an automated notification. Please respond to the user within 24 hours.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: INTERNAL_EMAIL,
      subject: `[REQUEST] ${name} - ${tourName || "General Inquiry"}`,
      html: htmlContent,
    });

    console.log(`✓ Internal notification sent to ${INTERNAL_EMAIL}`);
  } catch (error) {
    console.error("Failed to send internal notification email:", error);
    throw new Error("Failed to send internal notification");
  }
}

/**
 * Send payment information email to the user
 * Includes tour price, 30% advance payment required, and payment links
 */
export async function sendPaymentInfoEmail({
  name,
  email,
  tourName,
  tourPrice,
  advanceAmount,
  adults,
  children,
  preferredStartDate,
  requestId,
  stripePaymentUrl,
  paypalPaymentUrl,
}: {
  name: string;
  email: string;
  tourName: string;
  tourPrice: number;
  advanceAmount: number;
  adults: number;
  children: number;
  preferredStartDate?: string;
  requestId: string;
  stripePaymentUrl?: string;
  paypalPaymentUrl?: string;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const startDateString = preferredStartDate
      ? new Date(preferredStartDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be determined";

    const totalTravelers = adults + children;
    const remainingAmount = tourPrice - advanceAmount;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .price-box { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 2px solid #22c55e; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
            .price-box .total { font-size: 36px; font-weight: bold; color: #15803d; }
            .price-box .label { font-size: 14px; color: #166534; text-transform: uppercase; letter-spacing: 1px; }
            .advance-box { background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
            .advance-box .amount { font-size: 32px; font-weight: bold; color: #b45309; }
            .advance-box .note { font-size: 14px; color: #92400e; margin-top: 10px; }
            .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .info-table td:first-child { font-weight: bold; color: #374151; width: 40%; }
            .payment-buttons { margin: 30px 0; text-align: center; }
            .btn { display: inline-block; padding: 15px 40px; margin: 10px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; }
            .btn-stripe { background: #635bff; color: white !important; }
            .btn-paypal { background: #003087; color: white !important; }
            .btn-bank { background: #059669; color: white !important; }
            .bank-info { background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .bank-info h3 { margin-top: 0; color: #1f2937; }
            .bank-info p { margin: 5px 0; font-size: 14px; }
            .footer { background-color: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #6b7280; }
            .highlight { background-color: #fef3c7; padding: 2px 6px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Tour Booking Request Received!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Reference: ${requestId}</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for your interest in booking <strong>${tourName}</strong>! We're excited to help you plan your adventure.</p>
              
              <table class="info-table">
                <tr>
                  <td>Tour</td>
                  <td>${tourName}</td>
                </tr>
                <tr>
                  <td>Travelers</td>
                  <td>${adults} adult(s)${
      children > 0 ? `, ${children} child(ren)` : ""
    } (${totalTravelers} total)</td>
                </tr>
                <tr>
                  <td>Preferred Date</td>
                  <td>${startDateString}</td>
                </tr>
              </table>

              <div class="price-box">
                <div class="label">Total Tour Price</div>
                <div class="total">$${tourPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}</div>
              </div>

              <div class="advance-box">
                <div class="label">⚡ 30% Advance Payment Required</div>
                <div class="amount">$${advanceAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}</div>
                <div class="note">Remaining $${remainingAmount.toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2 }
                )} due before tour start</div>
              </div>

              <p style="text-align: center; font-size: 18px; margin: 25px 0;">
                <strong>To confirm your booking, please pay the 30% advance:</strong>
              </p>

              <div class="payment-buttons">
                ${
                  stripePaymentUrl
                    ? `<a href="${stripePaymentUrl}" class="btn btn-stripe">💳 Pay with Card (Stripe)</a>`
                    : ""
                }
                ${
                  paypalPaymentUrl
                    ? `<a href="${paypalPaymentUrl}" class="btn btn-paypal">🅿️ Pay with PayPal</a>`
                    : ""
                }
              </div>

              <div class="bank-info">
                <h3>🏦 Bank Transfer Option</h3>
                <p><strong>Bank:</strong> Khan Bank</p>
                <p><strong>Account Name:</strong> UTravel LLC</p>
                <p><strong>Account Number:</strong> 5012345678</p>
                <p><strong>Reference:</strong> <span class="highlight">${requestId}</span></p>
                <p style="margin-top: 15px; color: #dc2626;"><strong>Important:</strong> Please include your booking reference in the transfer description.</p>
              </div>

              <p style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <strong>📌 What happens next?</strong><br/>
                Once we receive your 30% advance payment, we'll send you a confirmation email with your tour details and itinerary. The remaining balance is due 14 days before your tour start date.
              </p>

              <p>If you have any questions, feel free to reply to this email or contact us directly.</p>
              
              <p>Best regards,<br/><strong>The UTravel Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 UTravel. All rights reserved.</p>
              <p>This email was sent regarding booking request ${requestId}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: `💰 Payment Required - ${tourName} Booking (Ref: ${requestId})`,
      html: htmlContent,
    });

    console.log(`✓ Payment info email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send payment info email:", error);
    throw new Error("Failed to send payment info email");
  }
}

/**
 * Send booking confirmation email after payment is received
 */
export async function sendBookingConfirmationEmail({
  name,
  email,
  tourName,
  tourPrice,
  amountPaid,
  adults,
  children,
  preferredStartDate,
  requestId,
  paymentMethod,
}: {
  name: string;
  email: string;
  tourName: string;
  tourPrice: number;
  amountPaid: number;
  adults: number;
  children: number;
  preferredStartDate?: string;
  requestId: string;
  paymentMethod?: string;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const startDateString = preferredStartDate
      ? new Date(preferredStartDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be determined";

    const remainingAmount = tourPrice - amountPaid;
    const paymentPercentage = Math.round((amountPaid / tourPrice) * 100);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header .checkmark { font-size: 60px; margin-bottom: 10px; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .confirmed-badge { background: linear-gradient(135deg, #dcfce7, #bbf7d0); border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
            .confirmed-badge .status { font-size: 24px; font-weight: bold; color: #15803d; }
            .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .info-table td:first-child { font-weight: bold; color: #374151; width: 40%; }
            .payment-summary { background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .payment-summary h3 { margin-top: 0; color: #15803d; }
            .payment-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .next-steps { background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; }
            .next-steps h3 { margin-top: 0; color: #1d4ed8; }
            .next-steps ul { margin: 0; padding-left: 20px; }
            .next-steps li { margin: 8px 0; }
            .footer { background-color: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="checkmark">✅</div>
              <h1>Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Reference: ${requestId}</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Great news! Your booking for <strong>${tourName}</strong> has been <strong>confirmed</strong>!</p>
              
              <div class="confirmed-badge">
                <div class="status">🎉 BOOKING CONFIRMED</div>
                <p style="margin: 10px 0 0 0; color: #166534;">Payment received via ${
                  paymentMethod || "Online Payment"
                }</p>
              </div>

              <table class="info-table">
                <tr>
                  <td>Tour</td>
                  <td><strong>${tourName}</strong></td>
                </tr>
                <tr>
                  <td>Booking Reference</td>
                  <td><strong>${requestId}</strong></td>
                </tr>
                <tr>
                  <td>Travelers</td>
                  <td>${adults} adult(s)${
      children > 0 ? `, ${children} child(ren)` : ""
    }</td>
                </tr>
                <tr>
                  <td>Tour Date</td>
                  <td>${startDateString}</td>
                </tr>
              </table>

              <div class="payment-summary">
                <h3>💳 Payment Summary</h3>
                <div style="margin: 10px 0;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Total Tour Price:</span>
                    <span>$${tourPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; color: #22c55e; font-weight: bold;">
                    <span>Amount Paid (${paymentPercentage}%):</span>
                    <span>$${amountPaid.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}</span>
                  </div>
                  ${
                    remainingAmount > 0
                      ? `
                  <div style="display: flex; justify-content: space-between; color: #f59e0b; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #d1d5db;">
                    <span>Remaining Balance:</span>
                    <span>$${remainingAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}</span>
                  </div>
                  <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">Due 14 days before tour start date</p>
                  `
                      : `
                  <div style="display: flex; justify-content: space-between; color: #22c55e; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #d1d5db;">
                    <span>✓ Fully Paid</span>
                    <span>$0.00 remaining</span>
                  </div>
                  `
                  }
                </div>
              </div>

              <div class="next-steps">
                <h3>📋 What's Next?</h3>
                <ul>
                  <li>We'll send your detailed itinerary within 48 hours</li>
                  <li>Our team will contact you to confirm final arrangements</li>
                  ${
                    remainingAmount > 0
                      ? `<li>Please pay the remaining balance 14 days before the tour</li>`
                      : ""
                  }
                  <li>Pack your bags and get ready for an amazing adventure!</li>
                </ul>
              </div>

              <p>If you have any questions or need to make changes to your booking, please reply to this email or contact us.</p>
              
              <p>We can't wait to host you!</p>
              
              <p>Best regards,<br/><strong>The UTravel Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 UTravel. All rights reserved.</p>
              <p>Booking Reference: ${requestId}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: `✅ Booking Confirmed - ${tourName} (Ref: ${requestId})`,
      html: htmlContent,
    });

    console.log(`✓ Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    throw new Error("Failed to send booking confirmation email");
  }
}

/**
 * Send payment reminder email for incomplete payments
 */
export async function sendPaymentReminderEmail({
  name,
  email,
  tourName,
  tourPrice,
  amountPaid,
  advanceRequired,
  requestId,
  stripePaymentUrl,
  paypalPaymentUrl,
}: {
  name: string;
  email: string;
  tourName: string;
  tourPrice: number;
  amountPaid: number;
  advanceRequired: number;
  requestId: string;
  stripePaymentUrl?: string;
  paypalPaymentUrl?: string;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const remainingAdvance = advanceRequired - amountPaid;
    const paidPercentage = Math.round((amountPaid / tourPrice) * 100);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .reminder-box { background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
            .reminder-box .amount { font-size: 32px; font-weight: bold; color: #b45309; }
            .payment-buttons { margin: 30px 0; text-align: center; }
            .btn { display: inline-block; padding: 15px 40px; margin: 10px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; }
            .btn-stripe { background: #635bff; color: white !important; }
            .btn-paypal { background: #003087; color: white !important; }
            .footer { background-color: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Payment Reminder</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Reference: ${requestId}</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>We noticed that your booking for <strong>${tourName}</strong> is not yet confirmed.</p>
              
              <p>You've paid <strong>$${amountPaid.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}</strong> (${paidPercentage}% of total), but we need at least 30% ($${advanceRequired.toLocaleString(
      "en-US",
      { minimumFractionDigits: 2 }
    )}) to confirm your booking.</p>

              <div class="reminder-box">
                <div style="font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">Amount Needed to Confirm</div>
                <div class="amount">$${remainingAdvance.toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2 }
                )}</div>
              </div>

              <div class="payment-buttons">
                ${
                  stripePaymentUrl
                    ? `<a href="${stripePaymentUrl}" class="btn btn-stripe">💳 Complete Payment</a>`
                    : ""
                }
                ${
                  paypalPaymentUrl
                    ? `<a href="${paypalPaymentUrl}" class="btn btn-paypal">🅿️ Pay with PayPal</a>`
                    : ""
                }
              </div>

              <p>Please complete your payment soon to secure your spot. Tour availability is limited!</p>
              
              <p>Best regards,<br/><strong>The UTravel Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 UTravel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: `⏰ Payment Reminder - ${tourName} (Ref: ${requestId})`,
      html: htmlContent,
    });

    console.log(`✓ Payment reminder email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send payment reminder email:", error);
    throw new Error("Failed to send payment reminder email");
  }
}

/**
 * ==========================================
 * SEND PAYMENT LINK EMAIL TO CUSTOMER
 * ==========================================
 *
 * Sends a beautifully formatted email with the Stripe payment link
 * to the customer after they request a tour booking.
 *
 * @param to - Customer email address
 * @param customerName - Customer's full name
 * @param tourName - Name of the tour
 * @param totalPrice - Total tour price
 * @param amountToPay - Amount to pay now (30% advance or full)
 * @param paymentLink - Stripe checkout URL
 * @param requestId - Booking request ID for reference
 * @param preferredStartDate - Optional tour start date
 */
export async function sendPaymentLinkEmail({
  to,
  customerName,
  tourName,
  totalPrice,
  amountToPay,
  paymentLink,
  requestId,
  preferredStartDate,
}: {
  to: string;
  customerName: string;
  tourName: string;
  totalPrice: number;
  amountToPay: number;
  paymentLink: string;
  requestId: string;
  preferredStartDate?: string | null;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    // Format the date nicely
    const startDateString = preferredStartDate
      ? new Date(preferredStartDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be confirmed";

    // Calculate remaining amount
    const remainingAmount = totalPrice - amountToPay;
    const isAdvancePayment = amountToPay < totalPrice;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              color: #333; 
              margin: 0; 
              padding: 0;
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px 20px; 
              text-align: center;
              border-radius: 12px 12px 0 0; 
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
            }
            .content { 
              background-color: white; 
              padding: 30px; 
              border-radius: 0 0 12px 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .booking-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              color: #666;
            }
            .detail-value {
              font-weight: bold;
              text-align: right;
            }
            .price-box {
              background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .price-box .label {
              font-size: 14px;
              opacity: 0.9;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .price-box .amount {
              font-size: 36px;
              font-weight: bold;
              margin: 10px 0;
            }
            .price-box .note {
              font-size: 12px;
              opacity: 0.8;
            }
            .payment-button {
              display: block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              text-decoration: none;
              padding: 18px 30px;
              border-radius: 8px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin: 25px 0;
              transition: transform 0.2s;
            }
            .payment-button:hover {
              transform: scale(1.02);
            }
            .payment-methods {
              text-align: center;
              margin: 15px 0;
              color: #666;
              font-size: 14px;
            }
            .payment-icons {
              margin-top: 8px;
            }
            .payment-icons span {
              display: inline-block;
              margin: 0 5px;
              padding: 5px 10px;
              background: #f0f0f0;
              border-radius: 4px;
              font-size: 12px;
            }
            .info-box {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .info-box h4 {
              margin: 0 0 10px 0;
              color: #856404;
            }
            .info-box p {
              margin: 0;
              color: #856404;
              font-size: 14px;
            }
            .remaining-box {
              background-color: #e8f4fd;
              border: 1px solid #bee5eb;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .remaining-box p {
              margin: 0;
              color: #0c5460;
            }
            .footer { 
              margin-top: 20px; 
              text-align: center;
              font-size: 12px; 
              color: #6b7280; 
              padding: 20px;
            }
            .reference {
              background: #f0f0f0;
              padding: 10px;
              border-radius: 4px;
              font-family: monospace;
              text-align: center;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏔️ Your Mongolia Adventure Awaits!</h1>
              <p>Complete your payment to confirm your booking</p>
            </div>
            
            <div class="content">
              <p style="font-size: 18px;">Dear <strong>${customerName}</strong>,</p>
              
              <p>Thank you for choosing UTravel Mongolia! We're excited to help you experience the beauty of Mongolia.</p>
              
              <p>Your booking request has been received. Please complete your payment to confirm your spot.</p>

              <div class="booking-details">
                <h3 style="margin-top: 0; color: #667eea;">📋 Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Tour</span>
                  <span class="detail-value">${tourName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Start Date</span>
                  <span class="detail-value">${startDateString}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Price</span>
                  <span class="detail-value">$${totalPrice.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reference</span>
                  <span class="detail-value" style="font-family: monospace;">${requestId
                    .slice(-8)
                    .toUpperCase()}</span>
                </div>
              </div>

              <div class="price-box">
                <div class="label">${
                  isAdvancePayment ? "30% Advance Payment" : "Total Payment"
                }</div>
                <div class="amount">$${amountToPay.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}</div>
                ${
                  isAdvancePayment
                    ? `<div class="note">Remaining $${remainingAmount.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 }
                      )} due before tour start</div>`
                    : ""
                }
              </div>

              <a href="${paymentLink}" class="payment-button">
                💳 Pay Now - $${amountToPay.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </a>

              <div class="payment-methods">
                Secure payment powered by Stripe
                <div class="payment-icons">
                  <span>💳 Visa</span>
                  <span>💳 Mastercard</span>
                  <span>🍎 Apple Pay</span>
                  <span>📱 Google Pay</span>
                </div>
              </div>

              ${
                isAdvancePayment
                  ? `
              <div class="remaining-box">
                <p><strong>ℹ️ About Advance Payment:</strong> The 30% advance secures your booking. The remaining 70% ($${remainingAmount.toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2 }
                )}) can be paid before your tour starts or upon arrival in Mongolia.</p>
              </div>
              `
                  : ""
              }

              <div class="info-box">
                <h4>⏰ Important</h4>
                <p>This payment link will expire in 30 minutes. If it expires, please contact us for a new link.</p>
              </div>

              <p>If you have any questions, reply to this email or contact us at:</p>
              <ul>
                <li>Email: udelgombotamira@gmail.com</li>
                <li>WhatsApp: +976 XXXX XXXX</li>
              </ul>

              <p>We look forward to welcoming you to Mongolia! 🇲🇳</p>
              
              <p>Best regards,<br/><strong>The UTravel Mongolia Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2025 UTravel Mongolia. All rights reserved.</p>
              <p>Your adventure partner in Mongolia</p>
              <p style="color: #999; font-size: 10px;">
                Booking Reference: ${requestId}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"UTravel Mongolia" <${SMTP_USER}>`,
      to,
      subject: `💳 Complete Your Payment - ${tourName} | UTravel Mongolia`,
      html: htmlContent,
    });

    console.log(`✓ Payment link email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send payment link email:", error);
    throw new Error("Failed to send payment link email");
  }
}

/**
 * ==========================================
 * SEND PAYMENT CONFIRMATION EMAIL
 * ==========================================
 *
 * Sent after successful Stripe payment (triggered by webhook)
 */
export async function sendPaymentConfirmationEmail({
  to,
  customerName,
  tourName,
  amountPaid,
  totalPrice,
  requestId,
  preferredStartDate,
}: {
  to: string;
  customerName: string;
  tourName: string;
  amountPaid: number;
  totalPrice: number;
  requestId: string;
  preferredStartDate?: string | null;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const startDateString = preferredStartDate
      ? new Date(preferredStartDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be confirmed";

    const remainingAmount = totalPrice - amountPaid;
    const isFullyPaid = remainingAmount <= 0;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              color: #333; 
              margin: 0; 
              padding: 0;
              background-color: #f5f5f5;
            }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
              color: white; 
              padding: 30px 20px; 
              text-align: center;
              border-radius: 12px 12px 0 0; 
            }
            .content { 
              background-color: white; 
              padding: 30px; 
              border-radius: 0 0 12px 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .success-icon {
              font-size: 60px;
              margin-bottom: 10px;
            }
            .booking-confirmed {
              background-color: #d4edda;
              border: 2px solid #28a745;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .booking-confirmed h3 {
              color: #155724;
              margin: 0;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .details-table td {
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            .details-table td:first-child {
              color: #666;
            }
            .details-table td:last-child {
              font-weight: bold;
              text-align: right;
            }
            .footer { 
              text-align: center;
              font-size: 12px; 
              color: #6b7280; 
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1>Payment Successful!</h1>
              <p>Your Mongolia adventure is confirmed</p>
            </div>
            
            <div class="content">
              <p style="font-size: 18px;">Dear <strong>${customerName}</strong>,</p>
              
              <div class="booking-confirmed">
                <h3>🎉 Your Booking is ${
                  isFullyPaid ? "Fully Paid" : "Confirmed"
                }!</h3>
              </div>

              <p>Great news! We have received your payment. ${
                isFullyPaid
                  ? "Your tour is fully paid!"
                  : "Your booking is now secured."
              }</p>

              <table class="details-table">
                <tr>
                  <td>Tour</td>
                  <td>${tourName}</td>
                </tr>
                <tr>
                  <td>Start Date</td>
                  <td>${startDateString}</td>
                </tr>
                <tr>
                  <td>Amount Paid</td>
                  <td style="color: #28a745;">$${amountPaid.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}</td>
                </tr>
                ${
                  !isFullyPaid
                    ? `
                <tr>
                  <td>Remaining Balance</td>
                  <td style="color: #dc3545;">$${remainingAmount.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td>Reference</td>
                  <td style="font-family: monospace;">${requestId
                    .slice(-8)
                    .toUpperCase()}</td>
                </tr>
              </table>

              <h3>📋 What's Next?</h3>
              <ul>
                <li>Our team will contact you within 24 hours with detailed tour information</li>
                <li>You'll receive a complete itinerary and packing list</li>
                <li>We'll arrange airport pickup and all logistics</li>
                ${
                  !isFullyPaid
                    ? `<li>Remaining balance of $${remainingAmount.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 }
                      )} is due before tour start</li>`
                    : ""
                }
              </ul>

              <p>If you have any questions, don't hesitate to reach out!</p>
              
              <p>See you in Mongolia! 🇲🇳🏔️</p>
              
              <p>Best regards,<br/><strong>The UTravel Mongolia Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2025 UTravel Mongolia. All rights reserved.</p>
              <p>Booking Reference: ${requestId}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"UTravel Mongolia" <${SMTP_USER}>`,
      to,
      subject: `✅ Payment Confirmed - ${tourName} | UTravel Mongolia`,
      html: htmlContent,
    });

    console.log(`✓ Payment confirmation email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
    throw new Error("Failed to send payment confirmation email");
  }
}
