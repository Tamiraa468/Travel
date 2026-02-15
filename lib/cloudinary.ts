import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary — reads CLOUDINARY_URL env var automatically,
// or falls back to individual env vars
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dutauqy6m",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Build a Cloudinary delivery URL for a given public_id.
 * Always includes f_auto (format) and q_auto (quality) for optimal CDN delivery.
 *
 * @example
 * cloudinaryUrl('utravel/logo', { width: 200 })
 * // → https://res.cloudinary.com/dutauqy6m/image/upload/f_auto,q_auto,w_200/utravel/logo.png
 */
export function cloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    crop?: "fill" | "fit" | "scale" | "thumb" | "limit";
  },
): string {
  // Always include auto format + auto quality for CDN optimization
  const transforms: string[] = [
    `f_${options?.format || "auto"}`,
    `q_${options?.quality || "auto"}`,
  ];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);

  const transformStr = transforms.join(",");
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dutauqy6m";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${publicId}`;
}

/**
 * Ensure an image URL uses Cloudinary f_auto,q_auto transforms.
 * If it's already a Cloudinary URL without transforms, injects them.
 * If it's a non-Cloudinary URL, returns it unchanged.
 * Optionally applies width for responsive sizing.
 */
export function ensureCloudinaryOptimized(url: string, width?: number): string {
  if (!url) return url;

  const cloudBase = "https://res.cloudinary.com/dutauqy6m/image/upload";

  // Already a Cloudinary URL
  if (url.startsWith(cloudBase)) {
    // Check if transforms are already present (has /f_auto or /q_auto)
    const afterBase = url.slice(cloudBase.length + 1); // +1 for trailing /
    if (
      afterBase.startsWith("f_") ||
      afterBase.startsWith("q_") ||
      afterBase.startsWith("w_") ||
      afterBase.startsWith("c_")
    ) {
      // Transforms already applied — optionally resize
      if (width && !afterBase.includes(`w_${width}`)) {
        // Insert width if not present
        const parts = url.split("/upload/");
        if (parts.length === 2) {
          const [base, rest] = parts;
          // rest is like "f_auto,q_auto/utravel/img.jpg" — insert w_ into transform chain
          const firstSlash = rest.indexOf("/");
          if (firstSlash > 0) {
            const existingTransforms = rest.slice(0, firstSlash);
            const publicId = rest.slice(firstSlash + 1);
            return `${base}/upload/${existingTransforms},w_${width}/${publicId}`;
          }
        }
      }
      return url;
    }

    // No transforms — inject f_auto,q_auto
    const publicId = afterBase;
    const transforms = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
    return `${cloudBase}/${transforms}/${publicId}`;
  }

  // Not a Cloudinary URL — return as-is
  return url;
}

/**
 * Upload a file to Cloudinary (server-side only).
 *
 * @param filePath - Local file path or remote URL
 * @param publicId - Desired public_id in Cloudinary
 * @param folder   - Optional folder prefix
 */
export async function uploadToCloudinary(
  filePath: string,
  publicId: string,
  folder: string = "utravel",
) {
  return cloudinary.uploader.upload(filePath, {
    public_id: `${folder}/${publicId}`,
    overwrite: true,
    resource_type: "auto",
  });
}
