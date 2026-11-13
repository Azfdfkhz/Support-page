import { ApiError, apiFetch } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";
import { isValidReference } from "@/lib/validators";
import { mockDonationCampaign } from "@/data/mockDonationCampaign";

/**
 * Creates a donation. Runs in the browser.
 * payload: { creatorSlug, amount, name, contact, hideName, prayer, wantsUpdates, paymentMethod }
 * returns: { reference }
 *
 * Expected API: POST /donations (JSON) -> 201 { reference }
 * The server must validate the amount itself; the amount in the URL is not trusted.
 */
export async function createDonation(payload) {
  if (USE_MOCKS) {
    const bytes = crypto.getRandomValues(new Uint32Array(2));
    return { reference: `${Date.now()}${bytes[0] % 1000}${bytes[1] % 1000}` };
  }

  const data = await apiFetch("/donations", { method: "POST", json: payload, credentials: "include" });
  if (!isValidReference(data?.reference)) {
    throw new ApiError("Respons server tidak valid.", { code: "BAD_RESPONSE" });
  }
  return { reference: data.reference };
}

/**
 * Loads a donation for the success page (server). Returns null when it does not exist.
 * returns: { reference, amount, paymentLabel, status, campaign }
 *
 * Expected API: GET /donations/{reference} -> 200 { reference, amount, paymentLabel, status,
 *   campaign: { organizer, isOrganizerVerified, title, thumbnailUrl, daysLeft,
 *   collectedAmount, targetAmount, thanksText } } | 404
 * In mock mode the amount from the URL (`mockAmount`) is used.
 */
export async function getDonation(reference, mockAmount) {
  if (USE_MOCKS) {
    return {
      reference,
      amount: mockAmount,
      paymentLabel: "Transfer Bank",
      status: "success",
      campaign: mockDonationCampaign,
    };
  }
  try {
    return await apiFetch(`/donations/${encodeURIComponent(reference)}`, { credentials: "include", cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
