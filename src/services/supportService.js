import { PAYMENT_PATH } from "@/constants/routes";

/**
 * Sends a support (donation) request and returns where to continue.
 * payload: { amount, message }
 *
 * TODO: connect to the real API, e.g.
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supports`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!res.ok) throw new Error("Failed to create support");
 *   const { id } = await res.json();
 *   return { paymentPath: `${PAYMENT_PATH}?support=${id}` };
 */
export async function submitSupport(payload) {
  console.info("submitSupport (not connected to API yet):", payload);
  const query = new URLSearchParams({ amount: String(payload.amount) });
  if (payload.message) query.set("message", payload.message);
  return { paymentPath: `${PAYMENT_PATH}?${query.toString()}` };
}
