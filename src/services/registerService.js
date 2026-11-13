import { ApiError, apiFetch } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";

/**
 * Creates the logged-in user's support page. Runs in the browser.
 * payload: { photo (File | null), bio, instagram, tiktok, facebook, slug }
 * returns: { slug }
 *
 * Expected API: POST /support-pages (multipart/form-data, session cookie)
 *   -> 201 { slug } | 409 { code: "SLUG_TAKEN" } | 422 { message }
 */
export async function registerSupportPage({ photo, bio, instagram, tiktok, facebook, slug }) {
  if (USE_MOCKS) return { slug };

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
