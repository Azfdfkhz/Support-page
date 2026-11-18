import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { INTRO_PATH, REGISTER_PATH } from "@/constants/routes";
import { ApiError, apiFetch } from "@/lib/api";
import { LOGIN_URL, USE_MOCKS } from "@/lib/config";
import { mockDashboardSummary, mockSupports } from "@/data/mockDashboard";
import { normalizeSupport, normalizeSupportList, SUPPORTS_PAGE_SIZE } from "@/lib/supports";

const amount = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0);

/**
 * GET on the dashboard API with the user's cookies. Server only.
 * 401 -> login, 404 -> the user has no support page yet, so registration.
 */
async function dashboardFetch(path) {
  const cookieHeader = (await cookies()).toString();
  try {
    const data = await apiFetch(path, { headers: { Cookie: cookieHeader }, cache: "no-store" });
    if (!data || typeof data !== "object") throw new ApiError("Respons server tidak valid.", { code: "BAD_RESPONSE" });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(LOGIN_URL || INTRO_PATH);
    if (error instanceof ApiError && error.status === 404) redirect(REGISTER_PATH);
    throw error;
  }
}

/**
 * Returns the dashboard summary: { isActive, totalGift, supporterCount, activities[] }.
 *
 * Expected API: GET /me/summary -> 200 { isActive, totalGift, supporterCount, activities: [{ id, name, amount, message }] }
 *   | 401 not logged in | 404 no support page yet
 */
export async function getDashboardSummary() {
  if (USE_MOCKS) return mockDashboardSummary;

  const data = await dashboardFetch("/me/summary");
  return {
    isActive: data.isActive === true,
    totalGift: amount(data.totalGift),
    supporterCount: Math.round(amount(data.supporterCount)),
    activities: Array.isArray(data.activities) ? data.activities.map(normalizeSupport).filter(Boolean) : [],
  };
}

/**
 * Returns the first page of supports: { totalSupport, items[], nextCursor }, newest first.
 * Later pages and filters are loaded in the browser (supportsClientService).
 * Names are already limited by each supporter's privacy choice on the API side.
 *
 * Expected API: GET /me/supports?limit= -> 200 { totalSupport, items: [{ id, name, amount, message, createdAt }], nextCursor? }
 *   | 401 | 404 (same as above)
 */
export async function getSupports() {
  if (USE_MOCKS) return { ...mockSupports, nextCursor: "" };

  const data = await dashboardFetch(`/me/supports?limit=${SUPPORTS_PAGE_SIZE}`);
  return { totalSupport: amount(data.totalSupport), ...normalizeSupportList(data) };
}
