import { PAYMENT_PATH } from "@/constants/routes";

/**
 * Sends a support (donation) request and returns where to continue to payment.
 * payload: { amount, name, contact, message }
 *
 * TODO: connect to the real API, e.g.
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supports`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!res.ok) throw new Error("Failed to create support");
 *   const { paymentUrl } = await res.json();
 *   return { paymentPath: paymentUrl };
 */
export async function submitSupport(payload) {
  console.info("submitSupport (not connected to API yet):", payload);
  return { paymentPath: PAYMENT_PATH };
}
