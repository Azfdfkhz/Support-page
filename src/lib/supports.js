// Shared by the server service and the browser loader (no server-only imports here).

export const SUPPORT_FILTERS = ["all", "gift", "message"];
export const SUPPORTS_PAGE_SIZE = 20;

const text = (value) => (typeof value === "string" ? value.trim() : "");
const amount = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0);

export function normalizeSupport(item) {
  if (!item || typeof item !== "object") return null;
  const id = typeof item.id === "string" || typeof item.id === "number" ? String(item.id) : "";
  if (!id) return null;
  const date = new Date(item.createdAt);
  return {
    id,
    name: text(item.name) || "Anonim",
    amount: amount(item.amount),
    message: text(item.message),
    createdAt: Number.isNaN(date.getTime()) ? "" : date.toISOString(),
  };
}

/** { items, nextCursor } from an API list response; nextCursor is "" when there are no more. */
export function normalizeSupportList(data) {
  return {
    items: Array.isArray(data?.items) ? data.items.map(normalizeSupport).filter(Boolean) : [],
    nextCursor: text(data?.nextCursor),
  };
}

export const matchesFilter = (filter) => (item) =>
  filter === "gift" ? !item.message : filter === "message" ? Boolean(item.message) : true;
