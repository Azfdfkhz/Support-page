// Flow: intro (/) -> daftar -> ready -> creator page (/[slug]) -> confirm -> success
export const INTRO_PATH = "/";
export const REGISTER_PATH = "/daftar";
export const READY_PATH = "/ready";
export const CONFIRM_PATH = "/confirm";
export const SUCCESS_PATH = "/success";

/** Public page of a creator, e.g. hepi.in/Nadya */
export function creatorPath(slug) {
  return `/${encodeURIComponent(slug)}`;
}

/** Confirm page for a support of `amount` to the creator `slug`. */
export function confirmPath({ slug, amount, message }) {
  const query = new URLSearchParams({ creator: slug, amount: String(amount) });
  if (message) query.set("message", message);
  return `${CONFIRM_PATH}?${query.toString()}`;
}

// Creator dashboard
export const DASHBOARD_PATH = "/dashboard";
export const DASHBOARD_SUPPORTS_PATH = "/dashboard/dukungan";
export const DASHBOARD_PAGE_PATH = "/dashboard/halaman";
