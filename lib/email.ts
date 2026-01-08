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
// Updated: Official company email for all notifications
const INTERNAL_EMAIL = "info@maralgoodreamland.com";

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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 40px 30px; }
            .greeting { font-size: 18px; color: #1e293b; margin-bottom: 20px; }
            .info-card { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border-left: 4px solid #d4a574; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(212, 165, 116, 0.2); }
            .info-row:last-child { border-bottom: none; }
            .info-label { color: #64748b; font-size: 14px; }
            .info-value { color: #1e293b; font-weight: 600; }
            .message-text { color: #475569; line-height: 1.7; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
            .signature-name { color: #1e293b; font-weight: 600; }
            .signature-title { color: #d4a574; font-size: 14px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 25px 30px; text-align: center; font-size: 12px; }
            .footer a { color: #d4a574; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Request Received</h1>
            </div>
            <div class="gold-bar"></div>
            <div class="content">
              <p class="greeting">Dear ${name},</p>
              <p class="message-text">Thank you for your interest in exploring Mongolia with us. We have received your inquiry and our travel specialists are reviewing your request.</p>
              
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">Tour</span>
                  <span class="info-value">${
                    tourName || "General Inquiry"
                  }</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Travelers</span>
                  <span class="info-value">${adults || 1} adult(s), ${
      children || 0
    } child(ren)</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Preferred Date</span>
                  <span class="info-value">${startDateString}</span>
                </div>
              </div>

              <p class="message-text">Our team will send you personalized recommendations and pricing within 24 hours. If you have any urgent questions, please don't hesitate to contact us.</p>
              
              <div class="signature">
                <p class="signature-name">The Maralgoo Dreamland Team</p>
                <p class="signature-title">Your Gateway to Mongolia</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 Maralgoo Dreamland. All rights reserved.</p>
              <p><a href="mailto:info@maralgoodreamland.com">info@maralgoodreamland.com</a></p>
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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px; font-weight: 600; }
            .header .badge { display: inline-block; background: linear-gradient(135deg, #d4a574, #f5c478); color: #1e293b; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 30px; }
            .alert-text { color: #1e293b; font-weight: 600; margin-bottom: 20px; font-size: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { text-align: left; background: linear-gradient(135deg, #1e293b, #334155); color: #d4a574; padding: 12px 15px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #475569; }
            tr:hover { background-color: #fefce8; }
            .message-box { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border-left: 4px solid #d4a574; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .message-box strong { color: #1e293b; }
            .footer-note { margin-top: 25px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 20px 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Tour Request</h1>
              <div class="badge">Action Required</div>
            </div>
            <div class="gold-bar"></div>
            <div class="content">
              <p class="alert-text">A new booking inquiry has been received. Please review and respond promptly.</p>
              
              <table>
                <tr>
                  <th>Field</th>
                  <th>Details</th>
                </tr>
                <tr>
                  <td><strong>Full Name</strong></td>
                  <td>${name}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td><a href="mailto:${email}" style="color: #d4a574;">${email}</a></td>
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
                  <td><strong>Preferred Date</strong></td>
                  <td>${startDateString}</td>
                </tr>
                <tr>
                  <td><strong>Marketing Consent</strong></td>
                  <td>${marketingConsent ? "Yes" : "No"}</td>
                </tr>
              </table>

              ${
                message
                  ? `<div class="message-box"><strong>Customer Message:</strong><p style="margin: 10px 0 0 0; color: #475569;">${message.replace(
                      /\n/g,
                      "<br>"
                    )}</p></div>`
                  : ""
              }

              <div class="footer-note">
                Please respond to this inquiry within 24 hours.
              </div>
            </div>
            <div class="footer">
              <p>Maralgoo Dreamland Admin Notification System</p>
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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 26px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.8; font-size: 14px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 35px 30px; }
            .greeting { font-size: 17px; color: #1e293b; margin-bottom: 15px; }
            .message-text { color: #475569; line-height: 1.7; margin-bottom: 25px; }
            .info-table { width: 100%; margin: 25px 0; border-collapse: collapse; }
            .info-table td { padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
            .info-table td:first-child { color: #64748b; font-size: 14px; width: 40%; }
            .info-table td:last-child { color: #1e293b; font-weight: 600; text-align: right; }
            .price-card { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
            .price-card .label { color: #d4a574; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
            .price-card .amount { color: #ffffff; font-size: 38px; font-weight: 700; font-family: 'Playfair Display', Georgia, serif; }
            .advance-card { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border: 2px solid #d4a574; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
            .advance-card .label { color: #92400e; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
            .advance-card .amount { color: #1e293b; font-size: 34px; font-weight: 700; font-family: 'Playfair Display', Georgia, serif; }
            .advance-card .note { color: #78716c; font-size: 13px; margin-top: 10px; }
            .cta-text { text-align: center; font-size: 16px; color: #1e293b; font-weight: 500; margin: 30px 0 20px 0; }
            .btn { display: inline-block; padding: 16px 40px; margin: 8px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; transition: transform 0.2s; }
            .btn-primary { background: linear-gradient(135deg, #d4a574, #f5c478); color: #1e293b !important; }
            .btn-secondary { background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff !important; }
            .payment-buttons { margin: 25px 0; text-align: center; }
            .bank-section { background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
            .bank-section h3 { color: #1e293b; font-size: 16px; margin: 0 0 15px 0; font-family: 'Playfair Display', Georgia, serif; }
            .bank-section p { margin: 6px 0; font-size: 14px; color: #475569; }
            .bank-section .ref { display: inline-block; background: linear-gradient(135deg, #fefce8, #fef9c3); padding: 4px 12px; border-radius: 4px; font-family: monospace; color: #1e293b; font-weight: 600; }
            .bank-section .important { margin-top: 15px; padding: 12px; background-color: #fef2f2; border-left: 3px solid #d4a574; font-size: 13px; color: #78350f; }
            .next-steps { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #d4a574; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .next-steps strong { color: #1e293b; }
            .next-steps p { color: #475569; margin: 8px 0 0 0; font-size: 14px; line-height: 1.6; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
            .signature-name { color: #1e293b; font-weight: 600; }
            .signature-title { color: #d4a574; font-size: 14px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 25px 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Booking Request</h1>
              <p>Reference: ${requestId}</p>
            </div>
            <div class="gold-bar"></div>
            <div class="content">
              <p class="greeting">Dear ${name},</p>
              <p class="message-text">Thank you for choosing <strong>${tourName}</strong>. We're delighted to help you plan your Mongolian adventure.</p>
              
              <table class="info-table">
                <tr>
                  <td>Tour</td>
                  <td>${tourName}</td>
                </tr>
                <tr>
                  <td>Travelers</td>
                  <td>${adults} adult(s)${
      children > 0 ? `, ${children} child(ren)` : ""
    }</td>
                </tr>
                <tr>
                  <td>Preferred Date</td>
                  <td>${startDateString}</td>
                </tr>
              </table>

              <div class="price-card">
                <div class="label">Total Tour Price</div>
                <div class="amount">$${tourPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}</div>
              </div>

              <div class="advance-card">
                <div class="label">30% Advance Payment</div>
                <div class="amount">$${advanceAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}</div>
                <div class="note">Remaining $${remainingAmount.toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2 }
                )} due before tour start</div>
              </div>

              <p class="cta-text">To confirm your booking, please complete your advance payment:</p>

              <div class="payment-buttons">
                ${
                  stripePaymentUrl
                    ? `<a href="${stripePaymentUrl}" class="btn btn-primary">Pay with Card</a>`
                    : ""
                }
                ${
                  paypalPaymentUrl
                    ? `<a href="${paypalPaymentUrl}" class="btn btn-secondary">Pay with PayPal</a>`
                    : ""
                }
              </div>

              <div class="bank-section">
                <h3>Bank Transfer Option</h3>
                <p><strong>Bank:</strong> Khan Bank</p>
                <p><strong>Account Name:</strong> Maralgoo Dreamland LLC</p>
                <p><strong>Account Number:</strong> 5012345678</p>
                <p><strong>Reference:</strong> <span class="ref">${requestId}</span></p>
                <div class="important"><strong>Important:</strong> Please include your booking reference in the transfer description.</div>
              </div>

              <div class="next-steps">
                <strong>What happens next?</strong>
                <p>Once we receive your 30% advance payment, we'll send you a confirmation email with your complete tour details and itinerary. The remaining balance is due 14 days before your tour start date.</p>
              </div>

              <p class="message-text">If you have any questions, please don't hesitate to reply to this email.</p>
              
              <div class="signature">
                <p class="signature-name">The Maralgoo Dreamland Team</p>
                <p class="signature-title">Your Gateway to Mongolia</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 Maralgoo Dreamland. All rights reserved.</p>
              <p>Booking Reference: ${requestId}</p>
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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 30px; text-align: center; }
            .header .icon { font-size: 50px; margin-bottom: 15px; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.8; font-size: 14px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 35px 30px; }
            .greeting { font-size: 17px; color: #1e293b; margin-bottom: 15px; }
            .message-text { color: #475569; line-height: 1.7; }
            .confirmed-badge { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border: 2px solid #d4a574; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
            .confirmed-badge .status { font-size: 20px; font-weight: 700; color: #1e293b; font-family: 'Playfair Display', Georgia, serif; }
            .confirmed-badge .method { font-size: 13px; color: #78716c; margin-top: 5px; }
            .info-table { width: 100%; margin: 25px 0; border-collapse: collapse; }
            .info-table td { padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
            .info-table td:first-child { color: #64748b; font-size: 14px; width: 40%; }
            .info-table td:last-child { color: #1e293b; font-weight: 600; text-align: right; }
            .payment-summary { background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
            .payment-summary h3 { color: #1e293b; font-size: 16px; margin: 0 0 15px 0; font-family: 'Playfair Display', Georgia, serif; }
            .payment-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .payment-row:last-child { border-bottom: none; }
            .payment-row.paid { color: #166534; font-weight: 600; }
            .payment-row.remaining { color: #d4a574; }
            .next-steps { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #d4a574; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .next-steps h3 { color: #1e293b; font-size: 16px; margin: 0 0 12px 0; }
            .next-steps ul { margin: 0; padding-left: 20px; color: #475569; }
            .next-steps li { margin: 8px 0; line-height: 1.5; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
            .signature-name { color: #1e293b; font-weight: 600; }
            .signature-title { color: #d4a574; font-size: 14px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 25px 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">✓</div>
              <h1>Booking Confirmed</h1>
              <p>Reference: ${requestId}</p>
            </div>
            <div class="gold-bar"></div>
            <div class="content">
              <p class="greeting">Dear ${name},</p>
              <p class="message-text">Wonderful news! Your booking for <strong>${tourName}</strong> has been confirmed.</p>
              
              <div class="confirmed-badge">
                <div class="status">BOOKING CONFIRMED</div>
                <div class="method">Payment received via ${
                  paymentMethod || "Online Payment"
                }</div>
              </div>

              <table class="info-table">
                <tr>
                  <td>Tour</td>
                  <td>${tourName}</td>
                </tr>
                <tr>
                  <td>Reference</td>
                  <td>${requestId}</td>
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
                <h3>Payment Summary</h3>
                <div class="payment-row">
                  <span>Total Tour Price</span>
                  <span>$${tourPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}</span>
                </div>
                <div class="payment-row paid">
                  <span>Amount Paid (${paymentPercentage}%)</span>
                  <span>$${amountPaid.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}</span>
                </div>
                ${
                  remainingAmount > 0
                    ? `
                <div class="payment-row remaining">
                  <span>Remaining Balance</span>
                  <span>$${remainingAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}</span>
                </div>
                <p style="font-size: 12px; color: #64748b; margin: 10px 0 0 0;">Due 14 days before tour start</p>
                `
                    : `
                <div class="payment-row paid">
                  <span>Status</span>
                  <span>Fully Paid</span>
                </div>
                `
                }
              </div>

              <div class="next-steps">
                <h3>What's Next?</h3>
                <ul>
                  <li>We'll send your detailed itinerary within 48 hours</li>
                  <li>Our team will contact you to confirm final arrangements</li>
                  ${
                    remainingAmount > 0
                      ? `<li>Please pay the remaining balance 14 days before the tour</li>`
                      : ""
                  }
                  <li>Get ready for an unforgettable Mongolian adventure!</li>
                </ul>
              </div>

              <p class="message-text">If you have any questions or need to make changes, please reply to this email.</p>
              
              <div class="signature">
                <p class="signature-name">The Maralgoo Dreamland Team</p>
                <p class="signature-title">Your Gateway to Mongolia</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 Maralgoo Dreamland. All rights reserved.</p>
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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 30px; text-align: center; }
            .header .icon { font-size: 40px; margin-bottom: 15px; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.8; font-size: 14px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 35px 30px; }
            .greeting { font-size: 17px; color: #1e293b; margin-bottom: 15px; }
            .message-text { color: #475569; line-height: 1.7; }
            .reminder-card { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border: 2px solid #d4a574; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
            .reminder-card .label { color: #92400e; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
            .reminder-card .amount { color: #1e293b; font-size: 34px; font-weight: 700; font-family: 'Playfair Display', Georgia, serif; }
            .btn { display: inline-block; padding: 16px 40px; margin: 8px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; }
            .btn-primary { background: linear-gradient(135deg, #d4a574, #f5c478); color: #1e293b !important; }
            .btn-secondary { background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff !important; }
            .payment-buttons { margin: 25px 0; text-align: center; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
            .signature-name { color: #1e293b; font-weight: 600; }
            .signature-title { color: #d4a574; font-size: 14px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 25px 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">⏰</div>
              <h1>Payment Reminder</h1>
              <p>Reference: ${requestId}</p>
            </div>
            <div class="gold-bar"></div>
            <div class="content">
              <p class="greeting">Dear ${name},</p>
              <p class="message-text">We noticed that your booking for <strong>${tourName}</strong> is not yet confirmed.</p>
              
              <p class="message-text">You've paid <strong>$${amountPaid.toLocaleString(
                "en-US",
                { minimumFractionDigits: 2 }
              )}</strong> (${paidPercentage}% of total), but we need at least 30% ($${advanceRequired.toLocaleString(
      "en-US",
      { minimumFractionDigits: 2 }
    )}) to secure your spot.</p>

              <div class="reminder-card">
                <div class="label">Amount Needed to Confirm</div>
                <div class="amount">$${remainingAdvance.toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2 }
                )}</div>
              </div>

              <div class="payment-buttons">
                ${
                  stripePaymentUrl
                    ? `<a href="${stripePaymentUrl}" class="btn btn-primary">Complete Payment</a>`
                    : ""
                }
                ${
                  paypalPaymentUrl
                    ? `<a href="${paypalPaymentUrl}" class="btn btn-secondary">Pay with PayPal</a>`
                    : ""
                }
              </div>

              <p class="message-text">Please complete your payment soon to secure your spot. Tour availability is limited!</p>
              
              <div class="signature">
                <p class="signature-name">The Maralgoo Dreamland Team</p>
                <p class="signature-title">Your Gateway to Mongolia</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 Maralgoo Dreamland. All rights reserved.</p>
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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 50px 30px; text-align: center; }
            .header .icon { font-size: 40px; margin-bottom: 15px; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; }
            .header p { margin: 12px 0 0 0; opacity: 0.8; font-size: 15px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 40px 30px; }
            .greeting { font-size: 18px; color: #1e293b; margin-bottom: 20px; }
            .message-text { color: #475569; line-height: 1.8; margin-bottom: 25px; }
            .booking-card { background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0; }
            .booking-card h3 { color: #1e293b; font-size: 16px; margin: 0 0 20px 0; font-family: 'Playfair Display', Georgia, serif; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: #64748b; font-size: 14px; }
            .detail-value { color: #1e293b; font-weight: 600; text-align: right; }
            .detail-value.ref { font-family: monospace; background: linear-gradient(135deg, #fefce8, #fef9c3); padding: 4px 10px; border-radius: 4px; }
            .price-card { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; }
            .price-card .label { color: #d4a574; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
            .price-card .amount { color: #ffffff; font-size: 42px; font-weight: 700; font-family: 'Playfair Display', Georgia, serif; }
            .price-card .note { color: #94a3b8; font-size: 13px; margin-top: 12px; }
            .btn-pay { display: block; background: linear-gradient(135deg, #d4a574, #f5c478); color: #1e293b !important; text-decoration: none; padding: 18px 30px; border-radius: 8px; text-align: center; font-size: 17px; font-weight: 600; margin: 30px 0; transition: transform 0.2s; }
            .btn-pay:hover { transform: scale(1.02); }
            .payment-icons { text-align: center; margin: 20px 0; color: #64748b; font-size: 13px; }
            .payment-icons span { display: inline-block; margin: 0 8px; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; }
            .info-box { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border-left: 4px solid #d4a574; padding: 18px 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .info-box h4 { color: #1e293b; margin: 0 0 8px 0; font-size: 14px; }
            .info-box p { color: #78716c; margin: 0; font-size: 13px; line-height: 1.6; }
            .remaining-info { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 20px; border-radius: 8px; margin: 25px 0; }
            .remaining-info p { color: #475569; margin: 0; font-size: 14px; line-height: 1.6; }
            .contact-section { margin: 30px 0; }
            .contact-section p { color: #475569; margin: 5px 0; font-size: 14px; }
            .contact-section a { color: #d4a574; text-decoration: none; }
            .signature { margin-top: 35px; padding-top: 25px; border-top: 1px solid #e2e8f0; }
            .signature-name { color: #1e293b; font-weight: 600; font-size: 16px; }
            .signature-title { color: #d4a574; font-size: 14px; margin-top: 4px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 12px; }
            .footer p { margin: 5px 0; }
            .footer .ref { color: #64748b; font-size: 11px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">🏔️</div>
              <h1>Your Adventure Awaits</h1>
              <p>Complete your payment to confirm your booking</p>
            </div>
            <div class="gold-bar"></div>
            
            <div class="content">
              <p class="greeting">Dear <strong>${customerName}</strong>,</p>
              
              <p class="message-text">Thank you for choosing Maralgoo Dreamland. We're honored to be part of your journey to discover the beauty of Mongolia.</p>

              <div class="booking-card">
                <h3>Booking Details</h3>
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
                  <span class="detail-value ref">${requestId
                    .slice(-8)
                    .toUpperCase()}</span>
                </div>
              </div>

              <div class="price-card">
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

              <a href="${paymentLink}" class="btn-pay">
                Pay Now — $${amountToPay.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </a>

              <div class="payment-icons">
                Secure payment powered by Stripe
                <div style="margin-top: 10px;">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>Apple Pay</span>
                  <span>Google Pay</span>
                </div>
              </div>

              ${
                isAdvancePayment
                  ? `
              <div class="remaining-info">
                <p><strong>About Advance Payment:</strong> The 30% advance secures your booking. The remaining 70% can be paid before your tour starts or upon arrival in Mongolia.</p>
              </div>
              `
                  : ""
              }

              <div class="info-box">
                <h4>Important</h4>
                <p>This payment link will expire in 30 minutes. If it expires, please contact us for a new link.</p>
              </div>

              <div class="contact-section">
                <p>Questions? We're here to help:</p>
                <p>Email: <a href="mailto:info@maralgoodreamland.com">info@maralgoodreamland.com</a></p>
              </div>

              <p class="message-text">We look forward to welcoming you to Mongolia!</p>
              
              <div class="signature">
                <p class="signature-name">The Maralgoo Dreamland Team</p>
                <p class="signature-title">Your Gateway to Mongolia</p>
              </div>
            </div>
            
            <div class="footer">
              <p>© 2025 Maralgoo Dreamland. All rights reserved.</p>
              <p>Your trusted partner for authentic Mongolia adventures</p>
              <p class="ref">Booking Reference: ${requestId}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Maralgoo Dreamland" <${SMTP_USER}>`,
      to,
      subject: `💳 Complete Your Payment - ${tourName} | Maralgoo Dreamland`,
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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 50px 30px; text-align: center; }
            .header .icon { font-size: 50px; margin-bottom: 15px; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 12px 0 0 0; opacity: 0.8; font-size: 15px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 40px 30px; }
            .greeting { font-size: 18px; color: #1e293b; margin-bottom: 20px; }
            .message-text { color: #475569; line-height: 1.8; }
            .confirmed-badge { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border: 2px solid #d4a574; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; }
            .confirmed-badge h3 { color: #1e293b; margin: 0; font-size: 20px; font-family: 'Playfair Display', Georgia, serif; }
            .details-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .details-table td { padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
            .details-table td:first-child { color: #64748b; width: 40%; }
            .details-table td:last-child { font-weight: 600; color: #1e293b; text-align: right; }
            .details-table .paid { color: #166534; }
            .details-table .remaining { color: #d4a574; }
            .details-table .ref { font-family: monospace; background: linear-gradient(135deg, #fefce8, #fef9c3); padding: 4px 10px; border-radius: 4px; }
            .next-steps { background-color: #f8fafc; border-left: 4px solid #d4a574; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0; }
            .next-steps h3 { color: #1e293b; font-size: 16px; margin: 0 0 15px 0; font-family: 'Playfair Display', Georgia, serif; }
            .next-steps ul { margin: 0; padding-left: 20px; color: #475569; }
            .next-steps li { margin: 10px 0; line-height: 1.5; }
            .signature { margin-top: 35px; padding-top: 25px; border-top: 1px solid #e2e8f0; }
            .signature-name { color: #1e293b; font-weight: 600; font-size: 16px; }
            .signature-title { color: #d4a574; font-size: 14px; margin-top: 4px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 12px; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">✓</div>
              <h1>Payment Successful</h1>
              <p>Your Mongolia adventure is confirmed</p>
            </div>
            <div class="gold-bar"></div>
            
            <div class="content">
              <p class="greeting">Dear <strong>${customerName}</strong>,</p>
              
              <div class="confirmed-badge">
                <h3>${
                  isFullyPaid ? "Your Tour is Fully Paid" : "Booking Confirmed"
                }</h3>
              </div>

              <p class="message-text">Wonderful news! We have received your payment. ${
                isFullyPaid
                  ? "Your tour is fully paid and ready to go!"
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
                  <td class="paid">$${amountPaid.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}</td>
                </tr>
                ${
                  !isFullyPaid
                    ? `
                <tr>
                  <td>Remaining Balance</td>
                  <td class="remaining">$${remainingAmount.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td>Reference</td>
                  <td><span class="ref">${requestId
                    .slice(-8)
                    .toUpperCase()}</span></td>
                </tr>
              </table>

              <div class="next-steps">
                <h3>What's Next?</h3>
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
              </div>

              <p class="message-text">If you have any questions, don't hesitate to reach out. We're here to make your journey unforgettable.</p>
              
              <p class="message-text">See you in Mongolia!</p>
              
              <div class="signature">
                <p class="signature-name">The Maralgoo Dreamland Team</p>
                <p class="signature-title">Your Gateway to Mongolia</p>
              </div>
            </div>
            
            <div class="footer">
              <p>© 2025 Maralgoo Dreamland. All rights reserved.</p>
              <p>Booking Reference: ${requestId}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Maralgoo Dreamland" <${SMTP_USER}>`,
      to,
      subject: `✅ Payment Confirmed - ${tourName} | Maralgoo Dreamland`,
      html: htmlContent,
    });

    console.log(`✓ Payment confirmation email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
    throw new Error("Failed to send payment confirmation email");
  }
}

// ============================================
// INQUIRY-FIRST SALES MODEL EMAIL FUNCTIONS
// ============================================
// These emails support the human-closed sales process.
// NO payment links in auto-reply - just warm communication.
// Payment links are only sent manually by admin.
// ============================================

/**
 * Send auto-reply email when customer submits an inquiry
 * This email has NO payment links - just a warm thank you
 * Human agents will follow up personally
 */
export async function sendInquiryAutoReplyEmail({
  name,
  email,
  tourName,
  inquiryId,
}: {
  name: string;
  email: string;
  tourName?: string;
  inquiryId: string;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 50px 30px; text-align: center; }
            .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px; font-weight: 600; }
            .header .emoji { font-size: 48px; margin-bottom: 15px; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 40px 30px; }
            .greeting { font-size: 20px; color: #1e293b; margin-bottom: 20px; font-family: 'Playfair Display', Georgia, serif; }
            .message-text { color: #475569; line-height: 1.8; font-size: 15px; margin-bottom: 20px; }
            .highlight-box { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #22c55e; padding: 20px; margin: 25px 0; border-radius: 0 12px 12px 0; }
            .highlight-box h3 { color: #166534; margin: 0 0 12px 0; font-size: 16px; }
            .highlight-box ul { margin: 0; padding-left: 20px; color: #15803d; }
            .highlight-box li { margin: 8px 0; }
            .whatsapp-btn { display: inline-block; background: #25D366; color: white !important; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .trust-badges { display: flex; justify-content: center; gap: 30px; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .badge { text-align: center; }
            .badge-icon { font-size: 24px; margin-bottom: 5px; }
            .badge-text { font-size: 12px; color: #64748b; }
            .no-payment-note { background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border: 2px dashed #d4a574; padding: 20px; margin: 25px 0; border-radius: 12px; text-align: center; }
            .no-payment-note strong { color: #92400e; font-size: 16px; }
            .no-payment-note p { color: #78716c; margin: 10px 0 0 0; font-size: 14px; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
            .signature-name { color: #1e293b; font-weight: 600; margin: 0; }
            .signature-title { color: #d4a574; font-size: 14px; margin: 5px 0 0 0; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 25px 30px; text-align: center; font-size: 12px; }
            .footer a { color: #d4a574; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">🇲🇳</div>
              <h1>We Received Your Mongolia Travel Request!</h1>
            </div>
            <div class="gold-bar"></div>
            <div class="content">
              <p class="greeting">Sain baina uu, ${name}!</p>
              
              <p class="message-text">
                Thank you for your interest in exploring Mongolia with us${
                  tourName
                    ? ` – especially the <strong>${tourName}</strong>`
                    : ""
                }! 
                We're thrilled to help you create an unforgettable adventure.
              </p>

              <div class="highlight-box">
                <h3>✨ What Happens Next?</h3>
                <ul>
                  <li>A <strong>local Mongolian travel expert</strong> will personally review your request</li>
                  <li>You'll receive a <strong>customized itinerary</strong> within 24 hours</li>
                  <li>We'll answer all your questions and tailor everything to your preferences</li>
                  <li>Your trip, your pace – <strong>100% flexible</strong></li>
                </ul>
              </div>

              <div class="no-payment-note">
                <strong>💳 No Payment Required</strong>
                <p>This is just the beginning of our conversation. We'll discuss everything before any commitment.</p>
              </div>

              <p class="message-text" style="text-align: center;">
                <strong>Have urgent questions?</strong> Chat with us directly:
              </p>
              
              <p style="text-align: center;">
                <a href="https://wa.me/97689475188" class="whatsapp-btn">💬 WhatsApp Us</a>
              </p>

              <div class="trust-badges">
                <div class="badge">
                  <div class="badge-icon">🏆</div>
                  <div class="badge-text">Local Experts</div>
                </div>
                <div class="badge">
                  <div class="badge-icon">⭐</div>
                  <div class="badge-text">5-Star Reviews</div>
                </div>
                <div class="badge">
                  <div class="badge-icon">🛡️</div>
                  <div class="badge-text">Safe & Secure</div>
                </div>
              </div>
              
              <div class="signature">
                <p class="signature-name">The Maralgoo Dreamland Team</p>
                <p class="signature-title">Your Gateway to Mongolia</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 Maralgoo Dreamland. All rights reserved.</p>
              <p><a href="mailto:info@maralgoodreamland.com">info@maralgoodreamland.com</a> | <a href="https://wa.me/97689475188">+976 8947-5188</a></p>
              <p style="margin-top: 10px; font-size: 11px; color: #64748b;">Reference: ${inquiryId
                .slice(-8)
                .toUpperCase()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Maralgoo Dreamland" <${SMTP_USER}>`,
      to: email,
      subject: `We received your Mongolia travel request 🇲🇳`,
      html: htmlContent,
    });

    console.log(`✓ Inquiry auto-reply sent to ${email}`);
  } catch (error) {
    console.error("Failed to send inquiry auto-reply:", error);
    throw new Error("Failed to send inquiry auto-reply email");
  }
}

/**
 * Send internal notification to admin when new inquiry is received
 * Includes quick reply links for fast response
 */
export async function sendInquiryNotificationToAdmin({
  inquiryId,
  name,
  email,
  phone,
  country,
  travelMonth,
  groupSize,
  budgetRange,
  message,
  tourName,
}: {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  travelMonth?: string;
  groupSize?: string;
  budgetRange?: string;
  message?: string;
  tourName?: string;
}): Promise<void> {
  try {
    const transporter = getTransporter();
    const adminUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://travel-9jis.vercel.app";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; background-color: #f1f5f9; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 22px; }
            .header .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 15px; font-size: 12px; margin-top: 10px; }
            .content { background-color: #ffffff; padding: 30px; }
            .lead-score { display: inline-block; padding: 8px 16px; background: #fef3c7; color: #92400e; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { text-align: left; background: #f8fafc; color: #64748b; padding: 10px 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; }
            .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .quick-actions { background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; }
            .quick-actions h3 { margin: 0 0 15px 0; color: #166534; font-size: 16px; }
            .btn { display: inline-block; padding: 12px 24px; margin: 5px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
            .btn-email { background: #3b82f6; color: white !important; }
            .btn-whatsapp { background: #25D366; color: white !important; }
            .btn-admin { background: #1e293b; color: white !important; }
            .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Inquiry Received!</h1>
              <div class="badge">Action Required</div>
            </div>
            <div class="content">
              <div class="lead-score">🎯 Hot Lead - ${
                tourName ? "Tour Interest" : "General Inquiry"
              }</div>
              
              <table>
                <tr><th colspan="2">Contact Information</th></tr>
                <tr><td><strong>Name</strong></td><td>${name}</td></tr>
                <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td><strong>Phone</strong></td><td>${
                  phone || "Not provided"
                }</td></tr>
                <tr><td><strong>Country</strong></td><td>${
                  country || "Not specified"
                }</td></tr>
              </table>

              <table>
                <tr><th colspan="2">Trip Preferences</th></tr>
                ${
                  tourName
                    ? `<tr><td><strong>Interested In</strong></td><td><strong style="color: #059669;">${tourName}</strong></td></tr>`
                    : ""
                }
                <tr><td><strong>Travel Month</strong></td><td>${
                  travelMonth || "Flexible"
                }</td></tr>
                <tr><td><strong>Group Size</strong></td><td>${
                  groupSize || "Not specified"
                }</td></tr>
                <tr><td><strong>Budget Range</strong></td><td>${
                  budgetRange || "Not specified"
                }</td></tr>
              </table>

              ${
                message
                  ? `
                <div class="message-box">
                  <strong>Customer Message:</strong>
                  <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
                </div>
              `
                  : ""
              }

              <div class="quick-actions">
                <h3>⚡ Quick Actions</h3>
                <a href="mailto:${email}?subject=Re: Your Mongolia Travel Inquiry&body=Hi ${
      name.split(" ")[0]
    },%0D%0A%0D%0AThank you for your interest in traveling to Mongolia!" class="btn btn-email">📧 Reply by Email</a>
                ${
                  phone
                    ? `<a href="https://wa.me/${phone.replace(
                        /[^0-9]/g,
                        ""
                      )}" class="btn btn-whatsapp">💬 WhatsApp</a>`
                    : ""
                }
                <br><br>
                <a href="${adminUrl}/admin/inquiries?id=${inquiryId}" class="btn btn-admin">📋 View in Admin Panel</a>
              </div>

              <p style="text-align: center; color: #64748b; font-size: 13px;">
                ⏰ Best practice: Respond within 2 hours for highest conversion
              </p>
            </div>
            <div class="footer">
              <p>Maralgoo Dreamland CRM • Inquiry ID: ${inquiryId
                .slice(-8)
                .toUpperCase()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: INTERNAL_EMAIL,
      subject: `🔔 [NEW LEAD] ${name} - ${tourName || "General Inquiry"}`,
      html: htmlContent,
    });

    console.log(`✓ Admin notification sent for inquiry ${inquiryId}`);
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    throw new Error("Failed to send admin notification email");
  }
}

/**
 * Send payment link email to customer (Inquiry-First Flow)
 * This is triggered MANUALLY by admin after quotation is agreed
 */
export async function sendInquiryPaymentLinkEmail({
  name,
  email,
  tourName,
  amount,
  currency,
  paymentMethod,
  stripePaymentUrl,
  bankTransferRef,
  inquiryId,
}: {
  name: string;
  email: string;
  tourName: string;
  amount: number;
  currency: string;
  paymentMethod: "stripe" | "bank_transfer";
  stripePaymentUrl?: string;
  bankTransferRef?: string;
  inquiryId: string;
}): Promise<void> {
  try {
    const transporter = getTransporter();

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);

    const paymentContent =
      paymentMethod === "stripe"
        ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${stripePaymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4a574, #f5c478); color: #1e293b !important; padding: 18px 50px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px;">
          💳 Pay ${formattedAmount} Securely
        </a>
        <p style="margin-top: 15px; color: #64748b; font-size: 13px;">Powered by Stripe • 256-bit SSL encryption</p>
      </div>
    `
        : `
      <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #e2e8f0;">
        <h3 style="color: #1e293b; margin: 0 0 15px 0;">🏦 Bank Transfer Details</h3>
        <table style="width: 100%;">
          <tr><td style="padding: 8px 0; color: #64748b;">Bank Name:</td><td style="padding: 8px 0; font-weight: 600;">Khan Bank</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Account Name:</td><td style="padding: 8px 0; font-weight: 600;">Maralgoo Dreamland LLC</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Account Number:</td><td style="padding: 8px 0; font-weight: 600;">5012345678</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">SWIFT Code:</td><td style="padding: 8px 0; font-weight: 600;">KABORMNX</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Amount:</td><td style="padding: 8px 0; font-weight: 600; color: #059669;">${formattedAmount}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Reference:</td><td style="padding: 8px 0;"><code style="background: #fef3c7; padding: 4px 10px; border-radius: 4px; font-weight: 600;">${bankTransferRef}</code></td></tr>
        </table>
        <p style="margin-top: 15px; padding: 12px; background: #fef2f2; border-radius: 8px; color: #991b1b; font-size: 13px;">
          ⚠️ Important: Please include the reference code in your transfer description
        </p>
      </div>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 26px; font-family: Georgia, serif; }
            .gold-bar { height: 4px; background: linear-gradient(90deg, #d4a574, #f5c478, #d4a574); }
            .content { background-color: #ffffff; padding: 35px 30px; }
            .greeting { font-size: 18px; color: #1e293b; margin-bottom: 20px; }
            .message-text { color: #475569; line-height: 1.7; }
            .price-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
            .price-box .label { color: #166534; font-size: 14px; margin-bottom: 5px; }
            .price-box .amount { color: #15803d; font-size: 36px; font-weight: 700; }
            .tour-name { background: linear-gradient(135deg, #fefce8, #fef9c3); padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .tour-name strong { color: #1e293b; font-size: 18px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 25px 30px; text-align: center; font-size: 12px; }
            .footer a { color: #d4a574; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Mongolia Adventure Awaits! 🇲🇳</h1>
            </div>
            <div class="gold-bar"></div>
            <div class="content">
              <p class="greeting">Hi ${name},</p>
              
              <p class="message-text">
                Great news! Your custom itinerary is ready and we're excited to finalize your booking.
              </p>

              <div class="tour-name">
                <strong>${tourName}</strong>
              </div>

              <div class="price-box">
                <div class="label">Total Amount Due</div>
                <div class="amount">${formattedAmount}</div>
              </div>

              ${paymentContent}

              <p class="message-text">
                Once payment is received, we'll send you:
              </p>
              <ul style="color: #475569; line-height: 2;">
                <li>✅ Detailed day-by-day itinerary</li>
                <li>✅ Packing list for Mongolia</li>
                <li>✅ Airport pickup confirmation</li>
                <li>✅ Emergency contact numbers</li>
              </ul>

              <p class="message-text">
                Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/97689475188" style="color: #d4a574;">+976 8947-5188</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Maralgoo Dreamland</p>
              <p>Reference: ${inquiryId.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Maralgoo Dreamland" <${SMTP_USER}>`,
      to: email,
      subject: `💳 Complete Your Booking - ${tourName}`,
      html: htmlContent,
    });

    console.log(`✓ Payment link email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send payment link email:", error);
    throw new Error("Failed to send payment link email");
  }
}
