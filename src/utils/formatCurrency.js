/**
 * Formats a number as Indonesian Rupiah.
 * formatCurrency(5000)                      -> "Rp5.000"
 * formatCurrency(6191633, { spaced: true }) -> "Rp 6.191.633"
 */
/** Groups digits with dots, Indonesian style: "1500000" -> "1.500.000" */
export function formatThousands(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatCurrency(value, { spaced = false } = {}) {
  const number = Math.max(0, Math.round(Number(value) || 0));
  const grouped = String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp${spaced ? " " : ""}${grouped}`;
}
