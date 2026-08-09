import slugify from "slugify";
import readingTimeLib from "reading-time";

export function toSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
) {
  let slug = toSlug(base);
  let counter = 1;
  while (await exists(slug)) {
    slug = `${toSlug(base)}-${counter}`;
    counter += 1;
  }
  return slug;
}

export function calcReadingTime(content: string) {
  const stripped = content.replace(/<[^>]+>/g, " ");
  const stats = readingTimeLib(stripped);
  return Math.max(1, Math.ceil(stats.minutes));
}

export function excerpt(content: string, length = 160) {
  const stripped = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return stripped.length > length ? `${stripped.slice(0, length).trim()}…` : stripped;
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
