import { ApiError, apiFetch } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";
import { saveMockProfile } from "@/lib/mockProfileStore";

/**
 * Creates the logged-in user's support page. Runs in the browser.
 * payload: { photo (File | null), bio, instagram, tiktok, facebook, slug, account }
 * returns: { slug }
 *
 * The name and profile photo are NOT sent: the backend takes them from the logged-in Sharing
 * Happiness account (session cookie), so the account stays the single source of truth.
 * `account` is only used by demo mode to remember them.
 *
 * Expected API: POST /support-pages (multipart/form-data, session cookie)
 *   -> 201 { slug } | 409 { code: "SLUG_TAKEN" } | 422 { message }
 * The created page must then be returned by GET /creators/{slug} with `coverImageUrl` set.
 */
export async function registerSupportPage({ photo, bio, instagram, tiktok, facebook, slug, account }) {
  if (USE_MOCKS) {
    await saveMockProfile({ slug, account, bio, socials: { instagram, tiktok, facebook }, photo });
    return { slug };
  }

  const formData = new FormData();
  formData.append("slug", slug);
  formData.append("bio", bio);
  formData.append("instagram", instagram);
  formData.append("tiktok", tiktok);
  formData.append("facebook", facebook);
  if (photo) formData.append("photo", photo);

  const data = await apiFetch("/support-pages", { method: "POST", formData, credentials: "include" });
  const createdSlug = data?.slug;
  if (typeof createdSlug !== "string" || !createdSlug) {
    throw new ApiError("Respons server tidak valid.", { code: "BAD_RESPONSE" });
  }
  return { slug: createdSlug };
}
