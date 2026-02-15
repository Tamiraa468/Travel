/**
 * Client-safe Cloudinary image URL optimizer.
 * Ensures all Cloudinary URLs include f_auto,q_auto transforms.
 * For non-Cloudinary URLs, returns them unchanged.
 *
 * Usage: optimizeImage(url)        → f_auto,q_auto
 *        optimizeImage(url, 800)   → f_auto,q_auto,w_800
 */

const CLOUD_BASE = "https://res.cloudinary.com/dutauqy6m/image/upload";

export function optimizeImage(url: string, width?: number): string {
  if (!url) return url;

  // Already a Cloudinary URL
  if (url.startsWith(CLOUD_BASE)) {
    const afterUpload = url.slice(CLOUD_BASE.length + 1); // skip trailing /

    // Check if transforms are already present
    if (/^[fqwch]_/.test(afterUpload)) {
      // Already has transforms — add width if needed
      if (width && !afterUpload.includes(`w_${width}`)) {
        const firstSlash = afterUpload.indexOf("/");
        if (firstSlash > 0) {
          const transforms = afterUpload.slice(0, firstSlash);
          const publicId = afterUpload.slice(firstSlash + 1);
          return `${CLOUD_BASE}/${transforms},w_${width}/${publicId}`;
        }
      }
      return url;
    }

    // No transforms — inject f_auto,q_auto
    const transforms = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
    return `${CLOUD_BASE}/${transforms}/${afterUpload}`;
  }

  // Not a Cloudinary URL — return as-is
  return url;
}
