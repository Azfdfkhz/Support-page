import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { INTRO_PATH } from "@/constants/routes";
import { ApiError, apiFetch } from "@/lib/api";
import { LOGIN_URL, USE_MOCKS } from "@/lib/config";
import { mockAccount } from "@/data/mockAccount";

/**
 * Returns the logged-in Sharing Happiness account: { name, avatarUrl }.
 * Server only. The user's cookies are forwarded to the API.
 *
 * Expected API: GET /me -> 200 { name, avatarUrl } | 401 when not logged in.
 */
export async function getAccount() {
  if (USE_MOCKS) return mockAccount;

  const cookieHeader = (await cookies()).toString();
  try {
    const data = await apiFetch("/me", { headers: { Cookie: cookieHeader }, cache: "no-store" });
    return { name: String(data?.name ?? ""), avatarUrl: String(data?.avatarUrl ?? "") };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(LOGIN_URL || INTRO_PATH);
    throw error;
  }
}
