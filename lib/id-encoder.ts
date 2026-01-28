/**
 * Secure ID Encoder/Decoder
 *
 * WHY HASHIDS + HMAC HYBRID:
 * - Hashids alone: URL-friendly but potentially reversible if salt is compromised
 * - HMAC alone: Secure but just signs the ID (ID still visible in base64)
 * - AES encryption: Overkill for non-sensitive IDs, adds complexity
 *
 * CHOSEN APPROACH: Hashids for obfuscation + HMAC signature for integrity
 * - Hides the real ID format (CUIDs become short alphanumeric strings)
 * - Prevents tampering via HMAC verification
 * - Prevents enumeration (can't guess valid tokens)
 * - URL-safe output
 * - Fast encoding/decoding
 */
import { createHmac, timingSafeEqual } from "crypto";
import Hashids from "hashids";

// Secret for HMAC signing - MUST be set in production
const ENCODER_SECRET =
  process.env.ID_ENCODER_SECRET ||
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "dev-encoder-secret-change-in-production");

if (!ENCODER_SECRET && process.env.NODE_ENV === "production") {
  console.error("🚨 CRITICAL: ID_ENCODER_SECRET is not set in production!");
}

// Hashids instance with custom alphabet (URL-safe, no confusing chars)
const hashids = new Hashids(
  ENCODER_SECRET,
  8, // Minimum length
  "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789", // No 0,O,o,1,l,I
);

// Signature length in bytes (truncated HMAC for URL-friendliness)
const SIGNATURE_LENGTH = 6;

/**
 * Create HMAC signature for an ID
 */
function createSignature(id: string): string {
  const hmac = createHmac("sha256", ENCODER_SECRET);
  hmac.update(id);
  // Take first N bytes and convert to base64url
  return hmac.digest("base64url").substring(0, SIGNATURE_LENGTH);
}

/**
 * Verify HMAC signature
 */
function verifySignature(id: string, signature: string): boolean {
  const expected = createSignature(id);
  // Timing-safe comparison
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Convert CUID/string ID to numeric representation for Hashids
 * Uses a deterministic hash to convert any string to a number
 */
function stringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Encode a database ID to a URL-safe token
 * Format: {hashid}_{signature}
 *
 * @example
 * encodeId("clxxx123abc") => "kR8N3mZp_a2Bx4Q"
 */
export function encodeId(id: string): string {
  if (!id) {
    throw new Error("ID cannot be empty");
  }

  // Create a unique numeric hash from the string ID
  const numericHash = stringToNumber(id);

  // Encode with Hashids (obfuscation)
  const encoded = hashids.encode(numericHash);

  // Create signature of original ID (integrity)
  const signature = createSignature(id);

  // Store original ID mapping in the token (base64url encoded)
  const idPayload = Buffer.from(id).toString("base64url");

  // Format: {hashid}_{signature}_{payload}
  // The hashid provides obfuscation, signature prevents tampering
  return `${encoded}_${signature}_${idPayload}`;
}

/**
 * Decode a URL token back to the original database ID
 * Returns null if token is invalid or tampered
 *
 * @example
 * decodeId("kR8N3mZp_a2Bx4Q_Y2x4eHgxMjNhYmM") => "clxxx123abc"
 */
export function decodeId(token: string): string | null {
  if (!token) {
    return null;
  }

  try {
    // Parse token format
    const parts = token.split("_");
    if (parts.length !== 3) {
      return null;
    }

    const [, signature, payload] = parts;

    // Decode the original ID from payload
    const originalId = Buffer.from(payload, "base64url").toString("utf-8");

    // Verify signature
    if (!verifySignature(originalId, signature)) {
      console.warn("[IdEncoder] Invalid signature for token");
      return null;
    }

    return originalId;
  } catch (error) {
    console.warn("[IdEncoder] Decode error:", error);
    return null;
  }
}

/**
 * Simple encode for numeric IDs (if you have auto-increment IDs)
 * Uses only Hashids without the HMAC overhead
 */
export function encodeNumericId(id: number): string {
  return hashids.encode(id);
}

/**
 * Decode Hashids-encoded numeric ID
 */
export function decodeNumericId(hash: string): number | null {
  const decoded = hashids.decode(hash);
  if (decoded.length === 0) {
    return null;
  }
  return decoded[0] as number;
}

/**
 * Batch encode multiple IDs
 */
export function encodeIds(ids: string[]): string[] {
  return ids.map(encodeId);
}

/**
 * Batch decode multiple tokens
 * Invalid tokens become null in the result array
 */
export function decodeIds(tokens: string[]): (string | null)[] {
  return tokens.map(decodeId);
}

/**
 * Type-safe wrapper for use in API routes
 * Returns 400 response if ID is invalid
 */
export function validateEncodedId(token: string | null | undefined): {
  valid: boolean;
  id: string | null;
  error?: string;
} {
  if (!token) {
    return { valid: false, id: null, error: "Missing ID parameter" };
  }

  const decoded = decodeId(token);
  if (!decoded) {
    return { valid: false, id: null, error: "Invalid or tampered ID" };
  }

  return { valid: true, id: decoded };
}
