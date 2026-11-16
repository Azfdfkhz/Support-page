import Link from "next/link";

// Placeholder. Replace with the real payment page when it is ready.
export default function PaymentPage() {
  return (
    <main className="app-shell flex flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <h1 className="text-xl font-bold text-ink">Pembayaran</h1>
      <p className="text-sm text-muted">Halaman pembayaran belum tersedia.</p>
      <Link href="/" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
        Kembali
      </Link>
    </main>
  );
}
