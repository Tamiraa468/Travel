export function slugToTitle(slug: string): string {
  if (!slug) return "";

  return slug
    .trim()
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
