export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hepi.in").replace(/\/+$/, "");
export const SHORT_DOMAIN = "hepi.in";
export const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL || "";
export const CS_WHATSAPP_URL = process.env.NEXT_PUBLIC_CS_WHATSAPP_URL || "";

export const USE_MOCKS =
  !API_URL || process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";

export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");

export function assetPath(path) {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (BASE_PATH && (clean === BASE_PATH || clean.startsWith(`${BASE_PATH}/`))) {
    return clean;
  }
  return `${BASE_PATH}${clean}`;
}

// Domain shown in the dashboard's "Bagikan halamanmu" card (the design shows sharinghappiness.id).
export const DASHBOARD_DOMAIN = "sharinghappiness.id";
