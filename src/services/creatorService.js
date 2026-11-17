import { ApiError, apiFetch } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";
import { safeImageUrl } from "@/lib/safeUrl";
import { mockCampaigns } from "@/data/mockCampaigns";
import { mockCreator } from "@/data/mockCreator";

const text = (value) => (typeof value === "string" ? value.trim() : "");
const amount = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0);

// Never trust the API shape blindly: the page only ever receives plain, validated values.
function normalizeCreator(data, slug) {
  if (!data || typeof data !== "object") throw new ApiError("Respons server tidak valid.", { code: "BAD_RESPONSE" });
  const socials = data.socials && typeof data.socials === "object" ? data.socials : {};
  return {
    name: text(data.name) || slug,
    role: text(data.role),
    bio: text(data.bio),
    isVerified: data.isVerified === true,
    coverImageUrl: safeImageUrl(data.coverImageUrl),
    avatarImageUrl: safeImageUrl(data.avatarImageUrl),
    // Usernames or profile URLs; turned into safe links in lib/socials.js.
    socials: { instagram: text(socials.instagram), tiktok: text(socials.tiktok), facebook: text(socials.facebook) },
    // Optional. When the API sends it, an account without campaigns never renders or fetches the section.
    campaignCount: Number.isInteger(data.campaignCount) && data.campaignCount >= 0 ? data.campaignCount : undefined,
  };
}

function normalizeCampaign(item) {
  if (!item || typeof item !== "object") return null;
  const id = typeof item.id === "string" || typeof item.id === "number" ? String(item.id) : "";
  const title = text(item.title);
  if (!id || !title) return null;
  return {
    id,
    title,
    imageUrl: safeImageUrl(item.imageUrl),
    daysLeft: amount(item.daysLeft),
    collectedAmount: amount(item.collectedAmount),
    targetAmount: amount(item.targetAmount),
  };
}

/**
 * Returns the creator for a public page slug, or null when it does not exist.
 *
 * Expected API: GET /creators/{slug} -> 200 { name, role, bio, isVerified, coverImageUrl,
 *   avatarImageUrl, socials: { instagram, tiktok, facebook }, campaignCount? } | 404
 * `name` and `avatarImageUrl` are the owner's Sharing Happiness account name and photo.
 */
export async function getCreator(slug) {
  if (USE_MOCKS) return mockCreator;
  try {
    return normalizeCreator(await apiFetch(`/creators/${encodeURIComponent(slug)}`, { cache: "no-store" }), slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Returns the campaigns shown on a creator's page (empty when they have none).
 *
 * Expected API: GET /creators/{slug}/campaigns -> 200 [{ id, title, imageUrl, daysLeft,
 *   collectedAmount, targetAmount }]
 */
export async function getCampaigns(slug) {
  if (USE_MOCKS) return mockCampaigns;
  const data = await apiFetch(`/creators/${encodeURIComponent(slug)}/campaigns`, { cache: "no-store" });
  return Array.isArray(data) ? data.map(normalizeCampaign).filter(Boolean) : [];
}
