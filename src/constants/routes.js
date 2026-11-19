// Flow: intro (/) -> list -> ready -> creator page (/[slug])
export const INTRO_PATH = "/";
export const REGISTER_PATH = "/list";
export const READY_PATH = "/ready";

/** Public page of a creator, e.g. hepi.in/Nadya */
export function creatorPath(slug) {
  return `/${encodeURIComponent(slug)}`;
}

// Creator dashboard. Folders: app/dashboard/{summary,support,page}
export const DASHBOARD_PATH = "/dashboard"; // redirects to the summary
export const DASHBOARD_SUMMARY_PATH = "/dashboard/summary";
export const DASHBOARD_SUPPORTS_PATH = "/dashboard/support";
export const DASHBOARD_PAGE_PATH = "/dashboard/page";
