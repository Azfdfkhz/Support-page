import { apiFetch } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";
import { mockSupports } from "@/data/mockDashboard";
import { matchesFilter, normalizeSupportList, SUPPORTS_PAGE_SIZE } from "@/lib/supports";

/**
 * Loads one page of supports for a filter ("all" | "gift" | "message"). Runs in the browser.
 * Expected API: GET /me/supports?filter=&cursor=&limit= -> 200 { items, nextCursor }
 * `nextCursor` is empty (or missing) on the last page.
 */
export async function loadSupports({ filter, cursor }) {
  if (USE_MOCKS) {
    return { items: mockSupports.items.filter(matchesFilter(filter)), nextCursor: "" };
  }
  const query = new URLSearchParams({ filter, limit: String(SUPPORTS_PAGE_SIZE) });
  if (cursor) query.set("cursor", cursor);
  const data = await apiFetch(`/me/supports?${query.toString()}`, { credentials: "include", cache: "no-store" });
  return normalizeSupportList(data);
}
