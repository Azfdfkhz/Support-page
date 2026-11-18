import { mockCampaigns } from "@/data/mockCampaigns";

/**
 * Returns the campaigns shown on the support page.
 * TODO: replace the mock with the real API call, e.g.
 *   const res = await fetch(`${process.env.API_URL}/creators/${slug}/campaigns`);
 *   return res.json();
 * Expected item shape: { id, title, imageUrl, campaignUrl, daysLeft, collectedAmount, targetAmount }
 */
export async function getCampaigns(slug) {
  return mockCampaigns;
}
