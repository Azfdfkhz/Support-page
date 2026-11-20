import { assetPath } from "@/lib/config";

export function safeImageUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (text.startsWith("/") && !text.startsWith("//")) return assetPath(text);
  try {
    const url = new URL(text);
    const allowHttp = process.env.NODE_ENV !== "production";
    if (url.protocol === "https:" || (allowHttp && url.protocol === "http:")) return url.toString();
  } catch {

  }
  return "";
}
