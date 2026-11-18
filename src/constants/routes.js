// Flow: intro (/) -> list -> ready -> creator page (/[slug]) -> confirm -> success
export const INTRO_PATH = "/";
export const REGISTER_PATH = "/list";
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

// Creator dashboard. Folders: app/dashboard/{summary,support,page}
export const DASHBOARD_PATH = "/dashboard"; // redirects to the summary
export const DASHBOARD_SUMMARY_PATH = "/dashboard/summary";
export const DASHBOARD_SUPPORTS_PATH = "/dashboard/support";
export const DASHBOARD_PAGE_PATH = "/dashboard/page";
