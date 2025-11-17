import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_SECRET =
  process.env.SESSION_SECRET || "your-secret-key-change-in-production";
const SESSION_NAME = "admin_session";

export type SessionData = {
  isAdmin: boolean;
  email: string;
};

/**
 * Create signed session cookie
 */
export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(data);
  const timestamp = Date.now();
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${sessionData}${timestamp}`)
    .digest("hex");

  cookieStore.set(SESSION_NAME, `${sessionData}.${timestamp}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Get and verify session
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_NAME)?.value;

  if (!sessionCookie) return null;

  const [sessionData, timestamp, signature] = sessionCookie.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${sessionData}${timestamp}`)
    .digest("hex");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    return JSON.parse(sessionData);
  } catch {
    return null;
  }
}

/**
 * Delete session
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_NAME);
}

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(
  email: string,
  password: string
): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "password";
  return email === adminEmail && password === adminPassword;
}
