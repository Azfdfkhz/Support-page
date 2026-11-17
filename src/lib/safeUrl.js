// Guards for URLs that come from the API before they reach the DOM.

/**
 * Returns a usable image URL or "". Accepts https URLs and site-relative paths ("/x.png").
 * Plain http is accepted outside production only (local development).
 */
export function safeImageUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (text.startsWith("/") && !text.startsWith("//")) return text;
  try {
    const url = new URL(text);
    const allowHttp = process.env.NODE_ENV !== "production";
    if (url.protocol === "https:" || (allowHttp && url.protocol === "http:")) return url.toString();
  } catch {
    // Not a valid absolute URL.
  }
  return "";
}
