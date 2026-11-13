import { ApiError, apiFetch } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";
import { mockCampaigns } from "@/data/mockCampaigns";
import { mockCreator } from "@/data/mockCreator";

/**
 * Returns the creator for a public page slug, or null when it does not exist.
 *
 * Expected API: GET /creators/{slug} -> 200 { name, role, bio, isVerified, coverImageUrl,
 *   avatarImageUrl, socials: { instagram, tiktok, facebook } } | 404
 */
export async function getCreator(slug) {
  if (USE_MOCKS) return mockCreator;
  try {
    return await apiFetch(`/creators/${encodeURIComponent(slug)}`, { cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Returns the campaigns shown on a creator's page.
 *
 * Expected API: GET /creators/{slug}/campaigns -> 200 [{ id, title, imageUrl, daysLeft,
 *   collectedAmount, targetAmount }]
 */
export async function getCampaigns(slug) {
  if (USE_MOCKS) return mockCampaigns;
  const data = await apiFetch(`/creators/${encodeURIComponent(slug)}/campaigns`, { cache: "no-store" });
  return Array.isArray(data) ? data : [];
}
