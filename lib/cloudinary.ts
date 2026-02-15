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
 * Supports optional transformations.
 *
 * @example
 * cloudinaryUrl('utravel/logo', { width: 200, quality: 'auto' })
 * // → https://res.cloudinary.com/dutauqy6m/image/upload/w_200,q_auto/utravel/logo.png
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
  const transforms: string[] = [];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (options?.quality) transforms.push(`q_${options.quality}`);
  if (options?.format) transforms.push(`f_${options.format}`);

  const transformStr = transforms.length > 0 ? `${transforms.join(",")}/` : "";
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dutauqy6m";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}${publicId}`;
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
