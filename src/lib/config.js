// Central place for environment-driven settings. See .env.example.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hepi.in").replace(/\/+$/, "");
export const SHORT_DOMAIN = "hepi.in";
export const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL || "";
export const CS_WHATSAPP_URL = process.env.NEXT_PUBLIC_CS_WHATSAPP_URL || "";

/**
 * Mock data is used only when no API is configured AND mocks are allowed
 * (always in development; in production only with NEXT_PUBLIC_ENABLE_MOCKS=true).
 * Without an API in production the services fail loudly instead of faking success.
 */
export const USE_MOCKS =
  !API_URL && (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true");
