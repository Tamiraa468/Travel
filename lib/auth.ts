import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_NAME = "admin_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "change-this-in-production-to-a-secure-random-string";

export type SessionData = {
  isAdmin: boolean;
  email: string;
};

/**
 * Create HMAC signature for session data
 * Prevents session tampering (React2Shell mitigation)
 */
function signSession(data: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(data);
  return hmac.digest("hex");
}

/**
 * Verify session signature
 */
function verifySignature(data: string, signature: string): boolean {
  const expectedSignature = signSession(data);
  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Create signed session cookie - SECURED against tampering
 */
export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(data);
  const signature = signSession(sessionData);
  // Store data and signature together
  const signedSession = `${Buffer.from(sessionData).toString(
    "base64"
  )}.${signature}`;

  cookieStore.set(SESSION_NAME, signedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Changed from "lax" to "strict" for CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Get and verify session from cookie
 * Returns null if signature is invalid (tampered)
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    // Split the cookie into data and signature
    const [encodedData, signature] = sessionCookie.split(".");
    if (!encodedData || !signature) return null;

    const sessionData = Buffer.from(encodedData, "base64").toString("utf-8");

    // Verify signature - reject if tampered
    if (!verifySignature(sessionData, signature)) {
      console.warn(
        "Session signature verification failed - possible tampering attempt"
      );
      return null;
    }

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
