// Shared input validation (client forms and server pages).

export const SLUG_MIN = 3;
export const SLUG_MAX = 30;

// Slugs that would collide with app routes or common reserved paths.
const RESERVED_SLUGS = new Set([
  "daftar", "ready", "confirm", "success", "support", "intro", "api", "admin", "login", "masuk",
  "logout", "keluar", "static", "assets", "public", "robots.txt", "sitemap.xml", "favicon.ico",
]);

/** Returns an error message, or "" when the slug is valid. */
export function validateSlug(slug) {
  const value = String(slug ?? "").trim();
  if (!value) return "Link support page wajib diisi.";
  if (value.length < SLUG_MIN) return `Minimal ${SLUG_MIN} karakter.`;
  if (value.length > SLUG_MAX) return `Maksimal ${SLUG_MAX} karakter.`;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*[A-Za-z0-9]$/.test(value)) {
    return "Gunakan huruf, angka, titik, garis bawah, atau strip. Harus diawali dan diakhiri huruf/angka.";
  }
  if (RESERVED_SLUGS.has(value.toLowerCase())) return "Link ini tidak dapat digunakan.";
  return "";
}

/** Removes characters that are never valid in a slug while typing. */
export function sanitizeSlugInput(value) {
  return String(value ?? "").replace(/[^A-Za-z0-9._-]/g, "").slice(0, SLUG_MAX);
}

/** Normalizes "@user", " user " or "user" to "user". Returns { value, error }. */
export function normalizeHandle(raw) {
  const value = String(raw ?? "").trim().replace(/^@+/, "");
  if (!value) return { value: "", error: "" };
  if (!/^[A-Za-z0-9._]{1,30}$/.test(value)) {
    return { value, error: "Username tidak valid (huruf, angka, titik, garis bawah)." };
  }
  return { value, error: "" };
}

/** Accepts an email or an Indonesian mobile number. Returns an error message or "". */
export function validateContact(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "No WhatsApp/Email wajib diisi.";
  if (value.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? "" : "Format email tidak valid.";
  }
  const phone = value.replace(/[\s-]/g, "");
  return /^(\+62|62|0)8\d{7,12}$/.test(phone) ? "" : "Format nomor WhatsApp tidak valid.";
}

/** Donation reference ids from the URL: letters, digits, dash, underscore. */
export function isValidReference(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{6,64}$/.test(value);
}
