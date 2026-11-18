import { apiFetch } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";
import { saveMockProfile } from "@/lib/mockProfileStore";

/**
 * Updates the logged-in user's support page. Runs in the browser.
 * payload: { photo (File | null: only when a new one was chosen), bio, instagram, tiktok, facebook }
 * The link (slug) cannot be changed, and the name and avatar always come from the Sharing Happiness account.
 *
 * Expected API: PATCH /support-pages/me (multipart/form-data, session cookie) -> 200 | 422 { message }
 */
export async function updateSupportPage({ slug, account, photo, keepCover, bio, instagram, tiktok, facebook }) {
  if (USE_MOCKS) {
    await saveMockProfile({ slug, account, bio, socials: { instagram, tiktok, facebook }, photo, keepCover });
    return;
  }

  const formData = new FormData();
  formData.append("bio", bio);
  formData.append("instagram", instagram);
  formData.append("tiktok", tiktok);
  formData.append("facebook", facebook);
  if (photo) formData.append("photo", photo);

  await apiFetch("/support-pages/me", { method: "PATCH", formData, credentials: "include" });
}
