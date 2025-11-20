import { cookies } from "next/headers";

const SESSION_NAME = "admin_session";

export type SessionData = {
  isAdmin: boolean;
  email: string;
};

/**
 * Create session cookie - simplified without signature
 */
export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(data);

  cookieStore.set(SESSION_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie);
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
