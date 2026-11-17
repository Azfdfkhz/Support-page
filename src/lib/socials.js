// Social links on the public page. The API (or the register form) may give either a username
// ("nadya" / "@nadya") or a full profile URL; both are turned into a safe https link here.

import { normalizeHandle } from "./validators";

export const SOCIAL_PLATFORMS = {
  instagram: { label: "Instagram", hosts: ["instagram.com"], build: (handle) => `https://www.instagram.com/${handle}` },
  tiktok: { label: "TikTok", hosts: ["tiktok.com"], build: (handle) => `https://www.tiktok.com/@${handle}` },
  facebook: { label: "Facebook", hosts: ["facebook.com", "fb.com"], build: (handle) => `https://www.facebook.com/${handle}` },
};

// Order the icons are shown in.
export const SOCIAL_ORDER = ["instagram", "tiktok", "facebook"];

function hostMatches(hostname, hosts) {
  const host = hostname.toLowerCase();
  return hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

/** Returns a safe https URL for the platform, or "" when the value is empty or not acceptable. */
export function resolveSocialUrl(platform, raw) {
  const config = SOCIAL_PLATFORMS[platform];
  const text = String(raw ?? "").trim();
  if (!config || !text) return "";

  // A pasted link such as "https://instagram.com/nadya" or "instagram.com/nadya".
  if (/^https?:\/\//i.test(text) || /^[\w.-]+\.[a-z]{2,}\//i.test(text)) {
    try {
      const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
      if (!hostMatches(url.hostname, config.hosts)) return "";
      url.protocol = "https:";
      url.username = "";
      url.password = "";
      url.hash = "";
      return url.toString();
    } catch {
      return "";
    }
  }

  // A plain username, with or without "@".
  const { value, error } = normalizeHandle(text);
  return value && !error ? config.build(value) : "";
}

/** [{ platform, label, href }] for every platform that has a usable value, in display order. */
export function resolveSocialLinks(socials) {
  const source = socials && typeof socials === "object" ? socials : {};
  const links = [];
  for (const platform of SOCIAL_ORDER) {
    const href = resolveSocialUrl(platform, source[platform]);
    if (href) links.push({ platform, label: SOCIAL_PLATFORMS[platform].label, href });
  }
  return links;
}
