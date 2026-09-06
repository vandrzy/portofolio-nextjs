/**
 * Helper terpusat untuk mem-parsing data tags dari Google Sheet (format JSON string atau comma-separated string)
 */
export function parseTags(rawTags: string | undefined | null): string[] {
  if (!rawTags) return [];
  try {
    const parsed = JSON.parse(rawTags);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Fallback jika berupa koma-separated string
    return rawTags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
}
