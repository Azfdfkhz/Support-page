export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hepi.in").replace(/\/+$/, "");
export const SHORT_DOMAIN = "hepi.in";
export const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL || "";
export const CS_WHATSAPP_URL = process.env.NEXT_PUBLIC_CS_WHATSAPP_URL || "";

export const USE_MOCKS =
  !API_URL && (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true");

// Domain shown in the dashboard's "Bagikan halamanmu" card (the design shows sharinghappiness.id).
export const DASHBOARD_DOMAIN = "sharinghappiness.id";
