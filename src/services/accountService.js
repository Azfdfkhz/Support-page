import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { INTRO_PATH } from "@/constants/routes";
import { ApiError, apiFetch } from "@/lib/api";
import { LOGIN_URL, USE_MOCKS } from "@/lib/config";
import { safeImageUrl } from "@/lib/safeUrl";
import { mockAccount } from "@/data/mockAccount";

const text = (value) => (typeof value === "string" ? value.trim() : "");

/**
 * Returns the logged-in Sharing Happiness account: { name, username, avatarUrl }.
 * Server only. The user's cookies are forwarded to the API.
 *
 * The register form shows this name and photo as they are, so the user never has to type or upload
 * them again, and `username` (when the API has one) becomes the default page link.
 *
 * Expected API: GET /me -> 200 { name, username?, avatarUrl } | 401 when not logged in.
 */
export async function getAccount() {
  if (USE_MOCKS) return mockAccount;

  const cookieHeader = (await cookies()).toString();
  try {
    const data = await apiFetch("/me", { headers: { Cookie: cookieHeader }, cache: "no-store" });
    const username = text(data?.username);
    return { name: text(data?.name) || username, username, avatarUrl: safeImageUrl(data?.avatarUrl) };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(LOGIN_URL || INTRO_PATH);
    throw error;
  }
}
