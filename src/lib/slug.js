// The support page link is derived from the Sharing Happiness account and cannot be changed.
// The register form and the dashboard both use this, so they always show the same link.
export function defaultSlug(account) {
  return String(account?.username || account?.name || "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30);
}

/** The link of the account's support page: the one the API reports, else the one derived at registration. */
export function pageSlug(account) {
  return String(account?.pageSlug || "") || defaultSlug(account);
}
